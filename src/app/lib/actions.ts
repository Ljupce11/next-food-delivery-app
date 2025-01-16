"use server";

import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { signIn, signOut } from "../../../auth";
import { fetchRestaurants, updateCart } from "./data";
import type { CartData } from "./definitions";

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
