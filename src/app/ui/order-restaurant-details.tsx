"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { Image } from "@heroui/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { fetchRestaurantInfo } from "../lib/actions";
import type { Order, Restaurant } from "../lib/definitions";
import { useRestaurantsStore } from "../lib/stores/restaurantsStore";
import { OrderRestaurantDetailsSkeleton } from "./skeletons";

export default function OrderRestaurantDetails({ orderDetails }: { orderDetails: Order | null }) {
  const { restaurant_id, restaurant_avatar, restaurant_name } = orderDetails || {};
  const restaurants = useRestaurantsStore((state) => state.restaurants);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getRestaurantInfo = async () => {
      if (restaurant_id) {
        let restaurant = restaurants.find(({ id }) => id === restaurant_id);
        if (!restaurant) {
          setIsLoading(true);
          restaurant = await fetchRestaurantInfo(restaurant_id);
          setIsLoading(false);
        }
        setRestaurant(restaurant);
      }
    };
    getRestaurantInfo();
  }, [restaurant_id, restaurants]);

  return (
    <div className="flex w-full items-center gap-6">
      <Image
        removeWrapper
        width={100}
        height={100}
        alt="Event image"
        className="aspect-square object-cover"
        src={`/api/image-proxy?url=${encodeURIComponent(restaurant_avatar || "")}`}
      />
      {isLoading ? (
        <OrderRestaurantDetailsSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <h1 className="text-lg font-semibold">{restaurant_name}</h1>
          <p className="text-sm text-default-500">{restaurant?.address}</p>
          <div className="flex items-center pt-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const id = index + 1;
              return <StarIcon key={id} className="size-4 text-yellow-400" />;
            })}
            <p className="pl-2 text-sm font-semibold text-default-400">{restaurant?.rating}</p>
          </div>
          <p className="text-sm text-default-500 pt-1">{restaurant?.cuisine}</p>
        </motion.div>
      )}
    </div>
  );
}
