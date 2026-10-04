"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { motion } from "motion/react";
import Image from "next/image";
import { Fragment, lazy, Suspense, useState } from "react";
import type { MenuItem, Restaurant } from "@/lib/definitions";
import { formatPrice } from "@/lib/format";

const LazyRestaurantMenuItemModal = lazy(
  () => import("../modals/restaurant-menu-item-modal"),
);

type Props = {
  restaurant: Restaurant;
  menuItems: MenuItem[];
};

export default function RestaurantPageMenuContent({
  restaurant,
  menuItems,
}: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null,
  );
  const [openCount, setOpenCount] = useState(0);

  const onCardClickHandler = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setOpenCount((count) => count + 1);
    onOpen();
  };

  return (
    <Fragment>
      {openCount > 0 && (
        <Suspense fallback={null}>
          <LazyRestaurantMenuItemModal
            key={openCount}
            isOpen={isOpen}
            restaurant={restaurant}
            selectedMenuItem={selectedMenuItem}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
      <motion.div
        className="w-full lg:w-3/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {menuItems.map((menuItem) => {
            const { id, name, price, image, description } = menuItem;
            return (
              <Card
                disableRipple
                key={id}
                isPressable
                shadow="sm"
                onPress={() => onCardClickHandler(menuItem)}
              >
                <CardBody className="overflow-visible">
                  <div className="relative h-[150px] w-full overflow-hidden rounded-xl">
                    <Image
                      fill
                      alt=""
                      src={image}
                      sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </CardBody>
                <CardFooter className="pt-0 flex-col items-start text-left">
                  <b className="text-sm">{name}</b>
                  <p className="text-xs line-clamp-2 min-h-[2lh]">
                    {description}
                  </p>
                  <Divider className="my-2.5" />
                  <p className="text-sm font-semibold">{formatPrice(price)}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </Fragment>
  );
}
