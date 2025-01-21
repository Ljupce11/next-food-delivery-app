import { create } from "zustand";
import type { Restaurant } from "../definitions";

type RestaurantStore = {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  removeRestaurant: (restaurantId: string) => void;
};

export const useRestaurantsStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  setRestaurants: (restaurants) => set({ restaurants }),
  addRestaurant: (restaurant) => set((state) => ({ restaurants: [...state.restaurants, restaurant] })),
  updateRestaurant: (restaurant) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) => (r.id === restaurant.id ? restaurant : r)),
    })),
  removeRestaurant: (restaurantId) =>
    set((state) => ({
      restaurants: state.restaurants.filter((r) => r.id !== restaurantId),
    })),
}));
