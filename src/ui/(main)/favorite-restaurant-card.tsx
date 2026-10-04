"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardFooter, Divider, Image } from "@heroui/react";
import NextImage from "next/image";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
  };
  isAboveFold: boolean;
}

export function FavoriteRestaurantCard({
  restaurant,
  isAboveFold,
}: RestaurantCardProps) {
  return (
    <Card isPressable disableRipple>
      <CardBody>
        <div className="relative h-50 w-full">
          <Image
            as={NextImage}
            fill
            loading={isAboveFold ? "eager" : "lazy"}
            removeWrapper
            src={restaurant.image}
            alt={restaurant.name}
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            radius="sm"
          />
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="justify-between">
        <h3 className="text-md font-semibold">{restaurant.name}</h3>
        <div className="flex items-center gap-1">
          <StarIcon className="size-4 text-yellow-400" />
          <span className="text-gray-700">{restaurant.rating.toFixed(1)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
