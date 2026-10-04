"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { Fragment, lazy, Suspense, useState } from "react";
import type { MenuItem, Restaurant } from "@/lib/definitions";
import { formatPrice } from "@/lib/format";
import {
  ALL_CATEGORIES,
  useSelectedCategory,
} from "@/lib/hooks/use-selected-category";

const LazyRestaurantMenuItemModal = lazy(
  () => import("../modals/restaurant-menu-item-modal"),
);

type Props = {
  restaurant: Restaurant;
  menuItems: MenuItem[];
};

type MenuGridProps = {
  menuItems: MenuItem[];
  onSelect: (menuItem: MenuItem) => void;
};

function MenuGrid({ menuItems, onSelect }: MenuGridProps) {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {menuItems.map((menuItem, index) => {
        const { id, name, price, image, description } = menuItem;
        return (
          <Card
            disableRipple
            key={id}
            isPressable
            shadow="sm"
            onPress={() => onSelect(menuItem)}
          >
            <CardBody className="overflow-visible">
              <div className="relative h-37.5 w-full overflow-hidden rounded-xl">
                <Image
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  alt=""
                  src={image}
                  sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex-col items-start text-left">
              <b className="text-sm">{name}</b>
              <p className="text-xs line-clamp-2 min-h-[2lh]">{description}</p>
              <Divider className="my-2.5" />
              <p className="text-sm font-semibold">{formatPrice(price)}</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function FilteredMenuGrid({ menuItems, onSelect }: MenuGridProps) {
  const category = useSelectedCategory([
    ...new Set(menuItems.map((menuItem) => menuItem.category)),
  ]);
  const visibleItems =
    category === ALL_CATEGORIES
      ? menuItems
      : menuItems.filter((menuItem) => menuItem.category === category);
  return <MenuGrid menuItems={visibleItems} onSelect={onSelect} />;
}

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
      <div className="w-full lg:w-3/4">
        <Suspense
          fallback={
            <MenuGrid menuItems={menuItems} onSelect={onCardClickHandler} />
          }
        >
          <FilteredMenuGrid
            menuItems={menuItems}
            onSelect={onCardClickHandler}
          />
        </Suspense>
      </div>
    </Fragment>
  );
}
