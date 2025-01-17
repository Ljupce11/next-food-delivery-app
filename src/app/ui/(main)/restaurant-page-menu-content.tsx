"use client";

import type { MenuItem } from "@/app/lib/definitions";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, CardFooter, Divider, Image } from "@heroui/react";

// const images = [
//   "https://nextui.org/images/fruit-7.jpeg",
//   "https://nextui.org/images/fruit-8.jpeg",
//   "https://nextui.org/images/fruit-5.jpeg",
//   "https://nextui.org/images/fruit-4.jpeg",
//   "https://nextui.org/images/fruit-3.jpeg",
// ];

type Props = {
  menuItems: MenuItem[];
  onOpen: () => void;
  setSelectedMenuItem: (data: { id: string; name: string; price: number; image: string }) => void;
};

export default function RestaurantPageMenuContent({ menuItems, onOpen, setSelectedMenuItem }: Props) {
  const onCardClickHandler = (id: string, name: string, price: number, image: string) => {
    onOpen();
    setSelectedMenuItem({ id, name, price, image });
  };

  return (
    <div className="w-full lg:w-3/4">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {menuItems.map(({ id, name, price, image }) => {
          return (
            <Card
              disableRipple
              key={id}
              isPressable
              shadow="sm"
              onPress={() => onCardClickHandler(id, name, price, image)}
            >
              <CardBody className="overflow-visible">
                <Image
                  alt={"image"}
                  width={"100%"}
                  height={"150px"}
                  className="object-cover rounded-xl"
                  src={image}
                  // src={images[index % images.length]}
                />
              </CardBody>
              <CardFooter className="pt-0 flex-col items-start">
                <b className="text-sm">{name}</b>
                <p className="text-xs">Some description here about this item</p>
                <Divider className="my-2.5" />
                <div className="flex items-center justify-between w-full text-sm">
                  <p className="font-semibold">{price}kr</p>
                  <div className="flex items-center gap-1 text-default-500">
                    <HandThumbUpIcon className="size-5" />
                    <p>100%</p>
                    <p>(16)</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
