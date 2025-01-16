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
