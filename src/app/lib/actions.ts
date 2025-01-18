"use server";

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "../../../auth";
import { fetchRestaurants, updateCart } from "./data";
import type { CartData, OrderItem, Restaurant } from "./definitions";
import { signUpSchema } from "./schemas";

export async function authenticate(prevState: string | undefined, formData: FormData) {
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

export async function signUp(_prevState: { success?: boolean; message?: string }, formData: FormData) {
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

export async function updateCartData(userId: string, cartData: CartData[], restaurantId: string) {
  const updatedCartData = await updateCart(userId, cartData);
  revalidatePath("/");
  revalidatePath(`/restaurant/${restaurantId}`);
  return updatedCartData;
}

export async function updateCartDataFromDrawer(userId: string, cartData: CartData[]) {
  try {
    const menuItems = await sql<CartData>`
      UPDATE users
      SET cart=${JSON.stringify(cartData)}
      WHERE id=${userId}
      RETURNING cart
    `;
    revalidatePath("/");
    return menuItems.rows[0];
  } catch (error) {
    console.error("Failed to update cart:", error);
    throw new Error("Failed to update cart.");
  }
}

export async function fetchRestaurantInfo(id: string) {
  try {
    const restaurant = await sql<Restaurant>`SELECT * FROM restaurants WHERE id=${id}`;
    return restaurant.rows[0];
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    throw new Error("Failed to fetch restaurant.");
  }
}

export async function fetchOrderItems(id: string) {
  try {
    const restaurant = await sql<OrderItem>`SELECT * FROM order_items WHERE order_id=${id}`;
    return restaurant.rows;
  } catch (error) {
    console.error("Failed to fetch order items:", error);
    throw new Error("Failed to fetch order items.");
  }
}
