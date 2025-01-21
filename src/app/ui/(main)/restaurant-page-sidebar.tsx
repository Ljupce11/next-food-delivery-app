"use client";

import type { Restaurant } from "@/app/lib/definitions";
import { ClockIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Divider, Image, Tab, Tabs } from "@heroui/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const categories = [
  { id: "all", label: "Show all" },
  { id: "most-popular", label: "Most popular" },
  { id: "burgers", label: "Burgers" },
  { id: "pizza", label: "Pizza" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export default function RestaurantPageSidebar({ restaurant }: { restaurant: Restaurant }) {
  const { name, address, cuisine, rating, image } = restaurant;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-1/6 overflow-x-hidden pt-9"
    >
      <div className="flex flex-col w-full items-center gap-6">
        <Image
          removeWrapper
          isBlurred
          width={100}
          height={100}
          alt="Restaurant logo"
          className="aspect-square object-cover"
          src={image}
        />
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-sm text-default-500">{address}</p>
          <div className="flex items-center pt-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const id = index + 1;
              return <StarIcon key={id} className="size-4 text-yellow-400" />;
            })}
            <p className="pl-2 text-sm font-semibold text-default-400">{rating}</p>
          </div>
          <p className="text-sm text-default-500 pt-1">{cuisine}</p>
          <div className="flex items-center gap-1 pt-1">
            <ClockIcon className="size-4" />
            <p className="text-green-600 text-sm font-semibold">Open now</p>
          </div>
        </div>
      </div>
      <Divider className="my-5" />
      <div className="overflow-auto">
        <Tabs className="mx-auto" isVertical={!(screenWidth < 1024)} aria-label="Dynamic tabs" items={categories}>
          {({ id, label }) => <Tab key={id} title={label} />}
        </Tabs>
      </div>
    </motion.div>
  );
}
