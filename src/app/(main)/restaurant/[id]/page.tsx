import { notFound } from "next/navigation";
import { z } from "zod";
import {
  fetchMenuCategories,
  fetchRestaurant,
  fetchRestaurantIds,
} from "@/lib/data";
import RestaurantPageMenu from "@/ui/(main)/restaurant-page-menu";
import RestaurantPageSidebar from "@/ui/(main)/restaurant-page-sidebar";

export async function generateStaticParams() {
  const ids = await fetchRestaurantIds();
  return ids.map((id) => ({ id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!z.guid().safeParse(id).success) {
    notFound();
  }
  const [restaurant, categories] = await Promise.all([
    fetchRestaurant(id),
    fetchMenuCategories(id),
  ]);
  if (!restaurant) {
    notFound();
  }
  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <RestaurantPageSidebar restaurant={restaurant} categories={categories} />
      <RestaurantPageMenu restaurant={restaurant} />
    </div>
  );
}
