"use client";

import { Divider, Image, Tab, Tabs } from "@heroui/react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { type Key, startTransition, useOptimistic } from "react";
import type { MenuCategory, Restaurant } from "@/lib/definitions";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import RatingStars from "@/ui/rating-stars";

const ALL = "all";

type Props = {
  restaurant: Restaurant;
  categories: MenuCategory[];
  selectedCategory?: string;
};

export default function RestaurantPageSidebar({
  restaurant,
  categories,
  selectedCategory,
}: Props) {
  const { name, address, cuisine, rating, image } = restaurant;
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useOptimistic(selectedCategory ?? ALL);
  const tabs = [{ slug: ALL, name: "Show all" }, ...categories];

  const onSelectionChange = (key: Key) => {
    const slug = String(key);
    startTransition(() => {
      setSelectedKey(slug);
      router.replace(slug === ALL ? pathname : `${pathname}?category=${slug}`, {
        scroll: false,
      });
    });
  };

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
        <Tabs
          items={tabs}
          className="mx-auto"
          aria-label="Menu categories"
          isVertical={isDesktop}
          selectedKey={selectedKey}
          onSelectionChange={onSelectionChange}
        >
          {({ slug, name }) => <Tab key={slug} title={name} />}
        </Tabs>
      </div>
    </motion.div>
  );
}
