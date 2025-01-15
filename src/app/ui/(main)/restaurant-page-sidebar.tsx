"use client";

import type { Restaurant } from "@/app/lib/definitions";
import { Divider, Image, Tab, Tabs } from "@nextui-org/react";
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
    <div className="w-full lg:w-1/6 overflow-x-hidden">
      <div className="flex flex-col w-full items-center gap-6">
        <Image
          isBlurred
          width={100}
          height={100}
          alt="Event image"
          className="aspect-square object-cover"
          src={image}
        />
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-sm text-default-500">{address}</p>
          <div className="flex items-center pt-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const id = index + 1;
              return (
                <svg
                  key={id}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-yellow-400"
                >
                  <title>Rating</title>
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              );
            })}
            <p className="pl-2 text-sm font-semibold text-default-400">{rating}</p>
          </div>
          <p className="text-sm text-default-500 pt-1">{cuisine}</p>
          <div className="flex items-center gap-1 pt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <title>Time</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
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
    </div>
  );
}
