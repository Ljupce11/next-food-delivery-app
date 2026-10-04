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
  description: string | null;
  category: string;
  image_credit: string | null;
  image_credit_url: string | null;
};

export type MenuCategory = {
  slug: string;
  name: string;
};

export type AdvancedUser = {
  cart: CartData[];
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type CartData = {
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantRating: string;
  image: string;
  items: {
    id: string;
    name: string;
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
  restaurant_address: string;
  restaurant_rating: string;
  restaurant_cuisine: string;
  status: "In Progress" | "Delivered";
  items: OrderItem[];
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
