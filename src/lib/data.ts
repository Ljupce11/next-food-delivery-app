import { sql } from "@vercel/postgres";
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
    const restaurant =
      await sql<Restaurant>`SELECT * FROM restaurants WHERE id=${id}`;
    return restaurant.rows[0];
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    throw new Error("Failed to fetch restaurant.");
  }
}

export async function fetchMenuItems(id: string) {
  try {
    const menuItems =
      await sql<MenuItem>`SELECT * FROM menus WHERE restaurant_id=${id}`;
    return menuItems.rows;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    throw new Error("Failed to fetch menus.");
  }
}

export async function fetchUserData(id: string | null) {
  try {
    const userData =
      await sql<AdvancedUser>`SELECT id, name, email, phone, address, cart FROM users WHERE id=${id}`;
    return userData.rows[0];
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function updateCart(id: string, data: CartData[]) {
  try {
    const menuItems = await sql<MenuItem>`
      UPDATE users
      SET cart=${JSON.stringify(data)}
      WHERE id=${id}
      RETURNING cart
    `;
    return menuItems.rows[0];
  } catch (error) {
    console.error("Failed to update cart:", error);
    throw new Error("Failed to update cart.");
  }
}

export async function fetchOrders(id: string | null) {
  try {
    const orders =
      await sql<Order>`SELECT * FROM orders WHERE user_id=${id} ORDER BY order_date DESC;`;
    return orders.rows;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}

export async function fetchOrderAnalytics(id: string | null) {
  try {
    const order = await sql<OrderAnalytics>`
    SELECT 
      (SELECT COUNT(*) FROM orders WHERE user_id = ${id}) AS row_count_orders,
      (SELECT COUNT(DISTINCT restaurant_id) FROM orders WHERE user_id = ${id}) AS unique_restaurant_count,
      (SELECT SUM(total) FROM orders WHERE user_id = ${id}) AS total_sum,
      (SELECT SUM(oi.quantity) 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ${id}) AS total_quantity
    `;
    return order.rows[0];
  } catch (error) {
    console.error("Failed to fetch order analytics:", error);
    throw new Error("Failed to fetch order analytics.");
  }
}
