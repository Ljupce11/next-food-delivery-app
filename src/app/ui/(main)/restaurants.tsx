import { fetchRestaurants } from "../../lib/data";
import RestaurantCards from "./restaurant-cards";

export default async function Restaurants({ search }: { search?: string }) {
  const restaurants = await fetchRestaurants(search || "");

  if (!restaurants || restaurants.length === 0) {
    return <p className="mt-4 text-centre mx-auto text-gray-400">No restaurants found</p>;
  }

  return <RestaurantCards restaurants={restaurants} />;
}
