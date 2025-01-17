"use server";

import { sql } from "@vercel/postgres";
// import bcrypt from "bcryptjs";
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

export async function signUp(_prevState: { success?: boolean; message?: string }, formData: FormData) {
  const first_name = formData.get("first_name")?.toString();
  const last_name = formData.get("last_name")?.toString();
  const full_name = `${first_name} ${last_name}`;
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const address = "Halsjogatan 37, Malmö";
  return { success: true, message: "Account created successfully." };
  // try {
  //   const saltRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password || "", saltRounds);
  //   await sql`
  //     INSERT INTO users (id, name, email, password, phone, address, cart)
  //     VALUES
  //     (gen_random_uuid(), ${full_name}, ${email}, ${hashedPassword.toString()}, 0721234567, ${address}, ${JSON.stringify([])})
  //   `;
  //   return { success: true, message: "Account created successfully." };
  // } catch (error) {
  //   console.log("Error:", error);
  //   return { success: false, message: "Failed to create account." };
  // }
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
