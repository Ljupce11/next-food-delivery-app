"use client";

import { Divider, Image, Tab, Tabs } from "@heroui/react";
import NextImage from "next/image";
import { Suspense } from "react";
import type { MenuCategory, Restaurant } from "@/lib/definitions";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
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
  isVertical: boolean;
};

function CategoryTabs({
  categories,
  isVertical,
  selectedKey,
}: CategoryTabsProps & { selectedKey: string }) {
  return (
    <Tabs
      items={[{ slug: ALL_CATEGORIES, name: "Show all" }, ...categories]}
      className="mx-auto"
      aria-label="Menu categories"
      isVertical={isVertical}
      selectedKey={selectedKey}
      onSelectionChange={(key) => selectCategory(String(key))}
    >
      {({ slug, name }) => <Tab key={slug} title={name} />}
    </Tabs>
  );
}

function SelectedCategoryTabs(props: CategoryTabsProps) {
  const selectedKey = useSelectedCategory(
    props.categories.map(({ slug }) => slug),
  );
  return <CategoryTabs {...props} selectedKey={selectedKey} />;
}

export default function RestaurantPageSidebar({
  restaurant,
  categories,
}: Props) {
  const { name, address, cuisine, rating, image } = restaurant;
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

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
        <Suspense
          fallback={
            <CategoryTabs
              categories={categories}
              isVertical={isDesktop}
              selectedKey={ALL_CATEGORIES}
            />
          }
        >
          <SelectedCategoryTabs
            categories={categories}
            isVertical={isDesktop}
          />
        </Suspense>
      </div>
    </div>
  );
}
