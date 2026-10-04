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
}

export function FavoriteRestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card isPressable disableRipple>
      <CardBody>
        <Image
          as={NextImage}
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full object-cover"
          width={400}
          height={200}
          sizes="(min-width: 768px) 33vw, 100vw"
          radius="sm"
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
