import { sql } from "@vercel/postgres";
import type { Restaurant } from "./definitions";

export async function fetchRestaurants() {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const restaurants = await sql<Restaurant>`SELECT * FROM restaurants`;
    return restaurants.rows;
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    throw new Error("Failed to fetch restaurants.");
  }
}

export async function fetchRestaurant(id: string) {
  try {
    const restaurant = await sql<Restaurant>`SELECT * FROM restaurants WHERE id=${id}`;
    return restaurant.rows[0];
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    throw new Error("Failed to fetch restaurant.");
  }
}
