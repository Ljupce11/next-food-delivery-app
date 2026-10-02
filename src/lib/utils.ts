import type {
  AdvancedUser,
  CartData,
  MenuItem,
  Restaurant,
} from "./definitions";

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
