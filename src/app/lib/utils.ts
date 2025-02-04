import type {
  AdvancedUser,
  CartData,
  CheckoutOrderDetails,
  MenuItem,
  Restaurant,
} from "./definitions";

export function prepareCheckoutQueries(
  orderDetails: CheckoutOrderDetails,
  updatedCartData?: CartData[],
) {
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

  // First, add the params for the `orders` query
  const params = [
    new_order_id,
    user_id,
    restaurant_id,
    total,
    status,
    restaurant_name,
    restaurant_avatar,
  ];

  // Add the params for the `order_items` queries dynamically based on the `items` array
  items.forEach((item) => {
    params.push(
      new_order_id,
      item.name,
      item.amount,
      item.unitPrice,
      item.image,
    );
  });

  // Add the `user_id` parameter for the `UPDATE` query
  params.push(user_id);

  return {
    queries,
    params,
    items,
  };
}

export function addItemToCart(
  user: AdvancedUser,
  restaurant: Restaurant,
  selectedMenuItem: MenuItem,
) {
  if (!selectedMenuItem) {
    throw new Error("Selected menu item is required");
  }

  const newCartItem = {
    id: selectedMenuItem.id,
    name: selectedMenuItem.name,
    extra: "",
    price: selectedMenuItem.price,
    unitPrice: selectedMenuItem.price,
    amount: 1,
    image: selectedMenuItem.image,
  };

  const newRestaurantCart = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantAddress: restaurant.address,
    image: restaurant.image,
    items: [newCartItem],
  };

  // If user has no cart, create new cart with the restaurant and item
  if (!user.cart) {
    return [newRestaurantCart];
  }

  const updatedCartData = [...user.cart];

  // If cart is empty, add new restaurant cart
  if (updatedCartData.length === 0) {
    return [newRestaurantCart];
  }

  // Find if restaurant already exists in cart
  const existingRestaurantIndex = updatedCartData.findIndex(
    (cartData) => cartData.restaurantId === restaurant.id,
  );

  // If restaurant not found in cart, add new restaurant cart
  if (existingRestaurantIndex === -1) {
    return [...updatedCartData, newRestaurantCart];
  }

  const restaurantCart = updatedCartData[existingRestaurantIndex];

  // Find if item already exists in restaurant's cart
  const existingItem = restaurantCart.items.find(
    (item) => item.id === selectedMenuItem.id,
  );

  // If item exists, increment amount
  if (existingItem) {
    existingItem.amount += 1;
  } else {
    // If item doesn't exist, add new item
    restaurantCart.items.push(newCartItem);
  }

  return updatedCartData;
}
