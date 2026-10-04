"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { z } from "zod";

import { auth, signIn, signOut } from "../../auth";
import { DELIVERY_FEE } from "./constants";
import { fetchRestaurants } from "./data";
import { sql } from "./db";
import type { OrderItem, Restaurant } from "./definitions";
import { signUpSchema } from "./schemas";

// Any 8-4-4-4-12 id; z.uuid() would also enforce RFC version/variant bits
const uuidSchema = z.guid();

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
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    // One message per field: the first rule that failed
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      errors[field] ??= issue.message;
    }
    return { success: false, errors };
  }

  try {
    const { first_name, last_name, email, password } = parsed.data;
    const full_name = `${first_name} ${last_name}`;
    const address = "Halsjogatan 37, Malmö";
    const phone = "0721234567";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await sql`
      INSERT INTO users (id, name, email, password, phone, address, cart)
      VALUES
      (gen_random_uuid(), ${full_name}, ${email}, ${hashedPassword.toString()}, ${phone}, ${address}, ${JSON.stringify([])})
    `;
    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("Failed to create account:", error);
    return { success: false, message: "Failed to create account." };
  }
}

export async function signOutAction() {
  await signOut();
}

export async function searchRestaurants(query: string) {
  return await fetchRestaurants(query);
}

const quantitySchema = z.number().int().min(1).max(99);

// The cart is shown in the navbar of every page, so refresh the whole layout
const refreshCart = () => revalidatePath("/", "layout");

/** Adds one of a menu item to the cart (or increases its quantity). */
export async function addToCart(menuItemId: string) {
  const userId = await requireUserId();
  const id = uuidSchema.parse(menuItemId);

  // One atomic statement: no read-modify-write, so quick clicks can't overwrite
  // each other. Inserts nothing if the menu item doesn't exist.
  await sql`
    INSERT INTO cart_items (user_id, menu_item_id, quantity)
    SELECT ${userId}, m.id, 1 FROM menus m WHERE m.id = ${id}
    ON CONFLICT (user_id, menu_item_id)
    DO UPDATE SET quantity = LEAST(cart_items.quantity + 1, 99)
  `;
  refreshCart();
}

export async function setCartItemQuantity(
  menuItemId: string,
  quantity: number,
) {
  const userId = await requireUserId();
  const id = uuidSchema.parse(menuItemId);
  const amount = quantitySchema.parse(quantity);

  await sql`
    UPDATE cart_items SET quantity = ${amount}
    WHERE user_id = ${userId} AND menu_item_id = ${id}
  `;
  refreshCart();
}

export async function removeFromCart(menuItemId: string) {
  const userId = await requireUserId();
  const id = uuidSchema.parse(menuItemId);

  await sql`DELETE FROM cart_items WHERE user_id = ${userId} AND menu_item_id = ${id}`;
  refreshCart();
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
 * Turns the logged-in user's cart items from one restaurant into an order.
 * Everything is read from the database: names, prices and the total can't be
 * influenced by the client.
 */
export async function completeCheckout(restaurantId: string) {
  const userId = await requireUserId();
  const id = uuidSchema.parse(restaurantId);

  const [{ count }] = (await sql`
    SELECT count(*)::int AS count
    FROM cart_items c JOIN menus m ON m.id = c.menu_item_id
    WHERE c.user_id = ${userId} AND m.restaurant_id = ${id}
  `) as { count: number }[];
  if (count === 0) {
    throw new Error("There is nothing to check out for this restaurant.");
  }

  const orderId = randomUUID();
  try {
    // One transaction; RepeatableRead makes all three statements see the same
    // cart, even if it changes while the checkout runs.
    await sql.transaction(
      [
        sql`
          INSERT INTO orders (id, user_id, restaurant_id, total, status, restaurant_name, restaurant_avatar, order_date)
          SELECT ${orderId}, ${userId}, r.id, SUM(m.price * c.quantity) + ${DELIVERY_FEE},
                 'In Progress', r.name, r.image, NOW()
          FROM cart_items c
          JOIN menus m ON m.id = c.menu_item_id
          JOIN restaurants r ON r.id = m.restaurant_id
          WHERE c.user_id = ${userId} AND r.id = ${id}
          GROUP BY r.id, r.name, r.image
        `,
        // Orders keep a snapshot of names and prices: they are a historical record
        sql`
          INSERT INTO order_items (id, order_id, name, quantity, price, item_image)
          SELECT gen_random_uuid(), ${orderId}, m.name, c.quantity, m.price, m.image
          FROM cart_items c JOIN menus m ON m.id = c.menu_item_id
          WHERE c.user_id = ${userId} AND m.restaurant_id = ${id}
        `,
        sql`
          DELETE FROM cart_items c USING menus m
          WHERE m.id = c.menu_item_id AND c.user_id = ${userId} AND m.restaurant_id = ${id}
        `,
      ],
      { isolationLevel: "RepeatableRead" },
    );
  } catch (error) {
    console.error("Failed to complete checkout:", error);
    throw new Error("Failed to complete checkout.");
  }

  refreshCart();
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
