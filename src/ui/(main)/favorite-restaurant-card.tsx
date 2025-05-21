"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardFooter, Divider, Image } from "@heroui/react";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
  };
}

export function FavoriteRestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card isPressable disableRipple>
      <CardBody>
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          className="object-cover"
          height={200}
          radius="sm"
          width={"100%"}
        />
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
