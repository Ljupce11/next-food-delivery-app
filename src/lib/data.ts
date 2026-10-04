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
  if (!id) return undefined;
  try {
    const rows =
      await sql`SELECT id, name, email, phone, address FROM users WHERE id=${id}`;
    const user = rows[0] as Omit<AdvancedUser, "cart"> | undefined;
    return user ? { ...user, cart: await fetchCart(id) } : undefined;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function fetchCart(userId: string): Promise<CartData[]> {
  const rows = (await sql`
    SELECT r.id AS restaurant_id, r.name AS restaurant_name,
           r.address AS restaurant_address, r.image AS restaurant_image,
           m.id, m.name, m.price, m.image, c.quantity
    FROM cart_items c
    JOIN menus m ON m.id = c.menu_item_id
    JOIN restaurants r ON r.id = m.restaurant_id
    WHERE c.user_id = ${userId}
    ORDER BY c.added_at, m.name
  `) as {
    restaurant_id: string;
    restaurant_name: string;
    restaurant_address: string;
    restaurant_image: string;
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
  }[];

  const byRestaurant = new Map<string, CartData>();
  for (const row of rows) {
    let restaurant = byRestaurant.get(row.restaurant_id);
    if (!restaurant) {
      restaurant = {
        restaurantId: row.restaurant_id,
        restaurantName: row.restaurant_name,
        restaurantAddress: row.restaurant_address,
        image: row.restaurant_image,
        items: [],
      };
      byRestaurant.set(row.restaurant_id, restaurant);
    }
    const unitPrice = Number(row.price);
    restaurant.items.push({
      id: row.id,
      name: row.name,
      extra: "",
      unitPrice,
      price: unitPrice * row.quantity,
      amount: row.quantity,
      image: row.image,
    });
  }
  return [...byRestaurant.values()];
}

export async function fetchOrders(id: string | null) {
  try {
    const orders = await sql`
      SELECT o.*,
             r.address AS restaurant_address,
             r.rating AS restaurant_rating,
             r.cuisine AS restaurant_cuisine,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'order_id', oi.order_id,
                   'name', oi.name,
                   'quantity', oi.quantity,
                   'price', oi.price::text,
                   'item_image', oi.item_image
                 )
                 ORDER BY oi.name
               ) FILTER (WHERE oi.id IS NOT NULL),
               '[]'
             ) AS items
      FROM orders o
      JOIN restaurants r ON r.id = o.restaurant_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ${id}
      GROUP BY o.id, r.address, r.rating, r.cuisine
      ORDER BY o.order_date DESC
    `;
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
