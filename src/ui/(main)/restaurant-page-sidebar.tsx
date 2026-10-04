"use client";

import { Divider, Image, Tab, Tabs } from "@heroui/react";
import NextImage from "next/image";
import type { MenuCategory, Restaurant } from "@/lib/definitions";
import {
  ALL_CATEGORIES,
  selectCategory,
  useSelectedCategory,
} from "@/lib/hooks/use-selected-category";
import RatingStars from "@/ui/rating-stars";

type Props = {
  restaurant: Restaurant;
  categories: MenuCategory[];
};

type CategoryTabsProps = {
  categories: MenuCategory[];
};

function CategoryTabs({ categories }: CategoryTabsProps) {
  const selectedKey = useSelectedCategory(categories.map(({ slug }) => slug));
  return (
    <Tabs
      items={[{ slug: ALL_CATEGORIES, name: "Show all" }, ...categories]}
      className="mx-auto"
      classNames={{ tabList: "lg:flex-col", tabContent: "text-default-600" }}
      aria-label="Menu categories"
      selectedKey={selectedKey}
      onSelectionChange={(key) => selectCategory(String(key))}
    >
      {({ slug, name }) => <Tab key={slug} title={name} />}
    </Tabs>
  );
}

export default function RestaurantPageSidebar({
  restaurant,
  categories,
}: Props) {
  const { name, address, cuisine, rating, image } = restaurant;

  return (
    <div className="w-full lg:w-1/6 overflow-x-hidden pt-9">
      <div className="flex flex-col w-full items-center gap-6">
        <Image
          as={NextImage}
          loading="eager"
          removeWrapper
          isBlurred
          width={100}
          height={100}
          alt="Restaurant logo"
          className="aspect-square object-cover"
          src={image}
        />
        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-sm text-default-500">{address}</p>
          <div className="flex items-center pt-1">
            <RatingStars rating={rating} />
            <p className="pl-2 text-sm font-semibold text-default-500">
              {rating}
            </p>
          </div>
          <p className="text-sm text-default-500 pt-1">{cuisine}</p>
        </div>
      </div>
      <Divider className="my-5" />
      <div className="overflow-auto">
        <CategoryTabs categories={categories} />
      </div>
    </div>
  );
}
