import { sql } from "./db";
import type {
  AdvancedUser,
  CartData,
  MenuItem,
  Order,
  OrderAnalytics,
  Restaurant,
} from "./definitions";

export async function fetchRestaurants(search: string) {
  try {
    const restaurants = await sql`
      SELECT * FROM restaurants
      WHERE LOWER(name) LIKE LOWER(${`%${search}%`})
    `;
    return restaurants as Restaurant[];
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    throw new Error("Failed to fetch restaurants.");
  }
}

export async function fetchRestaurant(id: string) {
  try {
    const rows = await sql`SELECT * FROM restaurants WHERE id=${id}`;
    return rows[0] as Restaurant;
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    throw new Error("Failed to fetch restaurant.");
  }
}

export async function fetchMenuItems(id: string) {
  try {
    const menuItems = await sql`SELECT * FROM menus WHERE restaurant_id=${id}`;
    return menuItems as MenuItem[];
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    throw new Error("Failed to fetch menus.");
  }
}

export async function fetchUserData(id: string | null) {
  try {
    const rows =
      await sql`SELECT id, name, email, phone, address, cart FROM users WHERE id=${id}`;
    return rows[0] as AdvancedUser | undefined;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function updateCart(id: string, data: CartData[]) {
  try {
    const rows = await sql`
      UPDATE users
      SET cart=${JSON.stringify(data)}
      WHERE id=${id}
      RETURNING cart
    `;
    return rows[0] as Pick<AdvancedUser, "cart"> | undefined;
  } catch (error) {
    console.error("Failed to update cart:", error);
    throw new Error("Failed to update cart.");
  }
}

export async function fetchOrders(id: string | null) {
  try {
    const orders =
      await sql`SELECT * FROM orders WHERE user_id=${id} ORDER BY order_date DESC`;
    return orders as Order[];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function fetchOrderAnalytics(id: string | null) {
  try {
    const rows = await sql`
      SELECT
        (SELECT COUNT(*) FROM orders WHERE user_id = ${id}) AS row_count_orders,
        (SELECT COUNT(DISTINCT restaurant_id) FROM orders WHERE user_id = ${id}) AS unique_restaurant_count,
        (SELECT SUM(total) FROM orders WHERE user_id = ${id}) AS total_sum,
        (SELECT SUM(oi.quantity)
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          WHERE o.user_id = ${id}) AS total_quantity
    `;
    return rows[0] as OrderAnalytics;
  } catch (error) {
    console.error("Failed to fetch order analytics:", error);
    throw new Error("Failed to fetch order analytics.");
  }
}
