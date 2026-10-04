import { fetchRestaurants } from "../../lib/data";
import RestaurantCards from "./restaurant-cards";

type Props = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default async function Restaurants({ searchParams }: Props) {
  const { search } = await searchParams;
  const restaurants = await fetchRestaurants(
    typeof search === "string" ? search : "",
  );

  if (!restaurants || restaurants.length === 0) {
    return (
      <p className="mt-4 text-centre mx-auto text-gray-400">
        No restaurants found
      </p>
    );
  }

  return <RestaurantCards restaurants={restaurants} />;
}
