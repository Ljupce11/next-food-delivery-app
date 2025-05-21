import { FavoriteRestaurantCard } from "@/ui/(main)/favorite-restaurant-card";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
}

export default function Page() {
  const favorites: Restaurant[] = [
    {
      id: "1",
      name: "BBQ Barn",
      image: "/img/restaurants/bbq-barn.webp",
      cuisine: "American",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Pizza Perfection",
      image: "/img/restaurants/pizza-perfection.webp",
      cuisine: "Italian",
      rating: 4.1,
    },
    {
      id: "3",
      name: "Sushi World",
      image: "/img/restaurants/sushi-world.webp",
      cuisine: "Japanese",
      rating: 4.8,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorite Restaurants</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            You haven't added any restaurants to your favorites yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((restaurant) => (
            <FavoriteRestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
