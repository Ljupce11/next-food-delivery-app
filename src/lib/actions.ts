"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth, signIn, signOut } from "../../auth";
import { DELIVERY_FEE } from "./constants";
import { fetchRestaurants, updateCart } from "./data";
import { sql } from "./db";
import type { CartData, MenuItem, OrderItem, Restaurant } from "./definitions";
import { cartSchema, signUpSchema } from "./schemas";

const uuidSchema = z.string().uuid();

/**
 * Server actions are public POST endpoints: anyone can call them with any
 * arguments. The user must always come from the session, never from an argument.
 */
async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You need to be logged in.");
  }
  return userId;
}

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function signUp(
  _prevState: { success?: boolean; message?: string },
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries());
  try {
    const { first_name, last_name, email, password } = signUpSchema.parse(data);
    const full_name = `${first_name} ${last_name}`;
    const address = "Halsjogatan 37, Malmö";
    const phone = "0721234567";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password || "", saltRounds);
    await sql`
      INSERT INTO users (id, name, email, password, phone, address, cart)
      VALUES
      (gen_random_uuid(), ${full_name}, ${email}, ${hashedPassword.toString()}, ${phone}, ${address}, ${JSON.stringify([])})
    `;
    return { success: true, message: "Account created successfully." };
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      const errors: Record<string, string> = {};
      // @ts-expect-error
      err.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      return { success: false, errors };
    }
    return { success: false, message: "Failed to create account." };
  }
}

export async function signOutAction() {
  await signOut();
}

export async function searchRestaurants(query: string) {
  return await fetchRestaurants(query);
}

export async function updateCartData(
  cartData: CartData[],
  restaurantId: string,
) {
  const userId = await requireUserId();
  const cart = cartSchema.parse(cartData);
  const id = uuidSchema.parse(restaurantId);

  const updatedCartData = await updateCart(userId, cart);
  revalidatePath("/");
  revalidatePath(`/restaurant/${id}`);
  return updatedCartData;
}

export async function updateCartDataFromDrawer(cartData: CartData[]) {
  const userId = await requireUserId();
  const cart = cartSchema.parse(cartData);

  try {
    const rows = await sql`
      UPDATE users
      SET cart=${JSON.stringify(cart)}
      WHERE id=${userId}
      RETURNING cart
    `;
    revalidatePath("/");
    return rows[0] as { cart: CartData[] } | undefined;
  } catch (error) {
    console.error("Failed to update cart:", error);
    throw new Error("Failed to update cart.");
  }
}

// Restaurant info is public, so no session check is needed here.
export async function fetchRestaurantInfo(id: string) {
  try {
    const rows = await sql`SELECT * FROM restaurants WHERE id=${id}`;
    return rows[0] as Restaurant;
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    throw new Error("Failed to fetch restaurant.");
  }
}

export async function fetchOrderItems(orderId: string) {
  const userId = await requireUserId();

  try {
    // The join makes sure the order belongs to the logged-in user
    const orderItems = await sql`
      SELECT oi.*
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.order_id=${orderId} AND o.user_id=${userId}
    `;
    return orderItems as OrderItem[];
  } catch (error) {
    console.error("Failed to fetch order items:", error);
    throw new Error("Failed to fetch order items.");
  }
}

/**
 * Creates an order for the logged-in user from their cart.
 * The client only says WHICH restaurant to check out; names, prices and the
 * total all come from the database, so they can't be tampered with.
 */
export async function completeCheckout(
  restaurantId: string,
  cartData: CartData[],
) {
  const userId = await requireUserId();
  const cart = cartSchema.parse(cartData);
  const id = uuidSchema.parse(restaurantId);

  const restaurantCart = cart.find((c) => c.restaurantId === id);
  if (!restaurantCart || restaurantCart.items.length === 0) {
    throw new Error("There is nothing to check out for this restaurant.");
  }
  const remainingCart = cart.filter((c) => c.restaurantId !== id);
  const itemIds = restaurantCart.items.map((item) => item.id);

  try {
    // 1. Read: restaurant and current menu prices
    const [restaurant] = (await sql`
      SELECT id, name, image FROM restaurants WHERE id=${id}
    `) as Pick<Restaurant, "id" | "name" | "image">[];
    if (!restaurant) {
      throw new Error("Restaurant not found.");
    }

    const menuItems = (await sql.query(
      "SELECT id, name, price, image FROM menus WHERE restaurant_id = $1 AND id = ANY($2::uuid[])",
      [id, itemIds],
    )) as Pick<MenuItem, "id" | "name" | "price" | "image">[];
    const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));

    const lines = restaurantCart.items.map((cartItem) => {
      const menuItem = menuItemsById.get(cartItem.id);
      if (!menuItem) {
        throw new Error("An item in your cart is no longer available.");
      }
      return { menuItem, quantity: cartItem.amount };
    });

    const subtotal = lines.reduce(
      (sum, { menuItem, quantity }) => sum + Number(menuItem.price) * quantity,
      0,
    );
    const total = subtotal + DELIVERY_FEE;

    // 2. Write: everything in one atomic transaction. The order id is created
    //    here so the item inserts can reference it in the same batch.
    const orderId = randomUUID();
    await sql.transaction([
      sql`
        INSERT INTO orders (id, user_id, restaurant_id, total, status, restaurant_name, restaurant_avatar, order_date)
        VALUES (${orderId}, ${userId}, ${restaurant.id}, ${total}, 'In Progress', ${restaurant.name}, ${restaurant.image}, NOW())
      `,
      ...lines.map(
        ({ menuItem, quantity }) => sql`
          INSERT INTO order_items (id, order_id, name, quantity, price, item_image)
          VALUES (gen_random_uuid(), ${orderId}, ${menuItem.name}, ${quantity}, ${menuItem.price}, ${menuItem.image})
        `,
      ),
      // Parameterised: cart contents are never concatenated into the SQL string
      sql`UPDATE users SET cart=${JSON.stringify(remainingCart)} WHERE id=${userId}`,
    ]);
  } catch (error) {
    console.error("Failed to complete checkout:", error);
    throw new Error("Failed to complete checkout.");
  }

  revalidatePath("/");
}

export async function completeOrder(orderId: string) {
  const userId = await requireUserId();

  try {
    // Only the owner of the order can complete it
    await sql`
      UPDATE orders
      SET status='Delivered'
      WHERE id=${orderId} AND user_id=${userId}
    `;
    revalidatePath("/orders");
  } catch (error) {
    console.error("Failed to complete order:", error);
    throw new Error("Failed to complete order.");
  }
}
