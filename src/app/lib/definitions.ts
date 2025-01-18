export type Restaurant = {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: string;
  image: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  image: string;
};

export type AdvancedUser = {
  cart: CartData[];
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type CartData = {
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  image: string;
  items: {
    id: string;
    name: string;
    extra: string;
    price: number;
    unitPrice: number;
    amount: number;
    image: string;
  }[];
};

export type Order = {
  id: string;
  total: string;
  user_id: string;
  order_date: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_avatar: string;
  status: "In Progress" | "Delivered";
};

export type OrderItem = {
  id: string;
  name: string;
  price: string;
  order_id: string;
  quantity: number;
  item_image: string;
};

export type OrderAnalytics = {
  total_sum: string;
  total_quantity: string;
  row_count_orders: string;
  unique_restaurant_count: string;
};
