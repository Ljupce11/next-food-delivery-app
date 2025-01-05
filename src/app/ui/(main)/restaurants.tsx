import { fetchRestaurants } from "../../lib/data";
import RestaurantCards from "./restaurant-cards";

export default async function Restaurants() {
  const restaurants = await fetchRestaurants();

  if (!restaurants || restaurants.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return <RestaurantCards restaurants={restaurants} />;
}
