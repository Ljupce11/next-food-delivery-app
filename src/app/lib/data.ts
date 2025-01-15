import { sql } from "@vercel/postgres";
import type { MenuItem, Restaurant } from "./definitions";

export async function fetchRestaurants(search: string) {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const restaurants = await sql<Restaurant>`
  SELECT * FROM restaurants
  WHERE LOWER(name) LIKE LOWER(${`%${search}%`})
`;
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

export async function fetchMenuItems(id: string) {
  try {
    const menuItems = await sql<MenuItem>`SELECT * FROM menus WHERE restaurant_id=${id}`;
    return menuItems.rows;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    throw new Error("Failed to fetch menus.");
  }
}
