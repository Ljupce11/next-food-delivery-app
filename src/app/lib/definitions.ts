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
};
