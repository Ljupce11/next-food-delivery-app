import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { fetchMenuCategories, fetchRestaurant } from "@/lib/data";
import RestaurantPageMenu from "@/ui/(main)/restaurant-page-menu";
import RestaurantPageSidebar from "@/ui/(main)/restaurant-page-sidebar";
import { RestaurantPageMenuSkeleton } from "@/ui/skeletons";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  if (!z.guid().safeParse(id).success) {
    notFound();
  }
  const [restaurant, categories, { category }] = await Promise.all([
    fetchRestaurant(id),
    fetchMenuCategories(id),
    searchParams,
  ]);
  if (!restaurant) {
    notFound();
  }
  const selectedCategory = categories.find(
    ({ slug }) => slug === category,
  )?.slug;
  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <RestaurantPageSidebar
        restaurant={restaurant}
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <Suspense fallback={<RestaurantPageMenuSkeleton />}>
        <RestaurantPageMenu
          restaurant={restaurant}
          category={selectedCategory}
        />
      </Suspense>
    </div>
  );
}
