"use client";

import type { AdvancedUser, MenuItem, Restaurant } from "@/app/lib/definitions";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, CardFooter, Divider, Image, useDisclosure } from "@heroui/react";
import { motion } from "motion/react";
import { Fragment, Suspense, lazy, useState } from "react";

const LazyRestaurantMenuItemModal = lazy(() => import("../modals/restaurant-menu-item-modal"));

type Props = {
  restaurant: Restaurant;
  menuItems: MenuItem[];
};

export default function RestaurantPageMenuContent({ restaurant, menuItems }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const onCardClickHandler = (id: string, name: string, price: number, image: string, restaurant_id: string) => {
    onOpen();
    setSelectedMenuItem({ id, name, price, image, restaurant_id });
  };

  return (
    <Fragment>
      <Suspense fallback={null}>
        <LazyRestaurantMenuItemModal
          isOpen={isOpen}
          restaurant={restaurant}
          selectedMenuItem={selectedMenuItem}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />
      </Suspense>
      <motion.div
        className="w-full lg:w-3/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {menuItems.map(({ id, name, price, image, restaurant_id }) => {
            return (
              <Card
                disableRipple
                key={id}
                isPressable
                shadow="sm"
                onPress={() => onCardClickHandler(id, name, price, image, restaurant_id)}
              >
                <CardBody className="overflow-visible">
                  <Image
                    removeWrapper
                    alt={"image"}
                    width={"100%"}
                    height={"150px"}
                    className="object-cover rounded-xl"
                    src={`/api/image-proxy?url=${encodeURIComponent(image)}`}
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
      </motion.div>
    </Fragment>
  );
}
