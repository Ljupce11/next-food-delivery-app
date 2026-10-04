"use client";

import { Image } from "@heroui/react";
import { motion } from "motion/react";
import NextImage from "next/image";

import type { Order } from "../lib/definitions";
import RatingStars from "./rating-stars";

type Props = {
  orderDetails: Order | null;
};

export default function OrderRestaurantDetails({ orderDetails }: Props) {
  const {
    restaurant_avatar,
    restaurant_name,
    restaurant_address,
    restaurant_rating,
    restaurant_cuisine,
  } = orderDetails || {};

  return (
    <div className="flex w-full items-center gap-6">
      <Image
        as={NextImage}
        removeWrapper
        width={100}
        height={100}
        alt="Restaurant logo"
        className="aspect-square object-cover"
        src={restaurant_avatar || ""}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col"
      >
        <h1 className="text-lg font-semibold">{restaurant_name}</h1>
        <p className="text-sm text-default-500">{restaurant_address}</p>
        <div className="flex items-center pt-1">
          <RatingStars rating={restaurant_rating ?? 0} />
          <p className="pl-2 text-sm font-semibold text-default-400">
            {restaurant_rating}
          </p>
        </div>
        <p className="text-sm text-default-500 pt-1">{restaurant_cuisine}</p>
      </motion.div>
    </div>
  );
}
