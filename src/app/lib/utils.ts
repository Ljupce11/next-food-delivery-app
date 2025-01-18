import type { CartData, CheckoutOrderDetails } from "./definitions";

export function startsWith(str: string, prefix: string): boolean {
  const lowerStr = str.toLowerCase();
  const lowerPrefix = prefix.toLowerCase();

  if (lowerPrefix.length > lowerStr.length) {
    return false;
  }

  for (let i = 0; i < lowerPrefix.length; i++) {
    if (lowerStr[i] !== lowerPrefix[i]) {
      return false;
    }
  }

  return true;
}

export function prepareCheckoutQueries(orderDetails: CheckoutOrderDetails, updatedCartData?: CartData[]) {
  const {
    id: new_order_id,
    user_id,
    restaurant_id,
    total,
    status,
    restaurant_name,
    restaurant_avatar,
    items,
  } = orderDetails;

  const queries = [
    `
      INSERT INTO orders (id, user_id, restaurant_id, total, status, restaurant_name, restaurant_avatar, order_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());
    `,
  ];

  // Dynamically add the `INSERT INTO order_items` queries for each item in the `items` array
  items.forEach((_) => {
    const query = `
      INSERT INTO order_items (id, order_id, name, quantity, price, item_image)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5);
    `;

    queries.push(query);
  });

  // Add the `UPDATE` query for the user
  queries.push(`
    UPDATE users
    SET cart = '${JSON.stringify(updatedCartData)}'
    WHERE id = $1;
  `);

  // Prepare the params array
  // First, add the params for the `orders` query
  const params = [
    new_order_id, // For orders query (order_id)
    user_id, // user_id
    restaurant_id, // restaurant_id
    total, // total
    status, // status
    restaurant_name, // restaurant_name
    restaurant_avatar, // restaurant_avatar
  ];

  // Add the params for the `order_items` queries dynamically based on the `items` array
  items.forEach((item) => {
    params.push(new_order_id, item.name, item.amount, item.unitPrice, item.image);
  });

  // Add the `user_id` parameter for the `UPDATE` query
  params.push(user_id);

  return {
    queries,
    params,
    items,
  };
}
