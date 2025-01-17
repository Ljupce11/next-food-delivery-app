"use client";

import type { Restaurant } from "@/app/lib/definitions";
import { Card, CardFooter, Image } from "@heroui/react";
import Link from "next/link";
import { DeliveryIcon, RatingIcon } from "../icons";

type Props = {
  restaurants: Restaurant[];
};

export default function RestaurantCards({ restaurants }: Props) {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-8">
      {restaurants.map(({ id, name, image }) => (
        <Card key={id} isFooterBlurred className="border-none" radius="lg" shadow="sm">
          <Link href={`/restaurant/${id}`} key={id} prefetch={true}>
            <Image isZoomed alt={name} className="object-cover" height={200} src={image} width={"100%"} />
            <CardFooter className="justify-between before:bg-black/20 bg-white/50 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <div className="flex justify-between items-center w-full gap-2">
                <p className="text-tiny text-black font-bold">{name}</p>
                <div className="flex items-center text-black  gap-1">
                  <div className="flex items-center gap-1 md:hidden xl:flex">
                    <DeliveryIcon />
                    <p className="text-small">59kr</p>
                    <p>|</p>
                  </div>
                  <RatingIcon />
                  <p className="text-small">4.5</p>
                </div>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
