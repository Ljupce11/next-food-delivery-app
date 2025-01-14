"use client";

import type { Restaurant } from "@/app/lib/definitions";
import { Card, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";
import { DeliveryIcon, RatingIcon } from "../icons";

type Props = {
  restaurants: Restaurant[];
};

const images = [
  "https://marketplace.canva.com/EAFvbySe1qM/2/0/1600w/canva-yellow-illustrative-kitchen-restaurant-logo-6jHucNoaV6Q.jpg",
  "https://assets.zenn.com/strapi_assets/restaurant_logo_21a1b41790.png",
  "https://coreldrawdesign.com/resources/previews/preview-restaurants-logo-design-cdr-template-vector-free-1704712805.jpg",
  "https://marketplace.canva.com/EAFXH3NOgek/1/0/1600w/canva-red-minimalist-restaurant-logo-2ygr4Ex-o9s.jpg",
  "https://media.istockphoto.com/id/1409883511/vector/hamburger-circle-badge-modern-logo-vector-icon-design-line-style.jpg?s=612x612&w=0&k=20&c=kVTQlio8Fo13jcMJpW16Wfv4nMrUIIg6WXr3FaUR7Tk=",
  "https://st3.depositphotos.com/7978858/18518/v/450/depositphotos_185187746-stock-illustration-fish-tail-logo-seafood-restaurant.jpg",
];

export default function RestaurantCards({ restaurants }: Props) {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-8">
      {restaurants.map(({ id, name }, index) => (
        <Link href={`/restaurant/${id}`} key={id}>
          <Card key={id} isFooterBlurred className="border-none" radius="lg" shadow="sm">
            <Image
              isZoomed
              alt={name}
              className="object-cover"
              height={200}
              src={images[index % images.length]}
              width={"100%"}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <div className="flex justify-between items-center w-full gap-2">
                <p className="text-tiny text-white font-bold bg-black/20 rounded-2xl py-2 px-3">{name}</p>
                <div className="flex items-center text-white bg-black/20 rounded-2xl py-2 px-3 gap-1">
                  <div className="flex items-center md:hidden xl:flex">
                    <DeliveryIcon />
                    <p className="text-small">59kr</p>
                    <p>|</p>
                  </div>
                  <RatingIcon />
                  <p className="text-small">4.5</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
