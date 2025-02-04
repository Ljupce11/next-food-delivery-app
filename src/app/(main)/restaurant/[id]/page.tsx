import { fetchRestaurant } from "@/lib/data";
import RestaurantPageMenu from "@/ui/(main)/restaurant-page-menu";
import RestaurantPageSidebar from "@/ui/(main)/restaurant-page-sidebar";
import { RestaurantPageMenuSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);
  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <RestaurantPageSidebar restaurant={restaurant} />
      <Suspense fallback={<RestaurantPageMenuSkeleton />}>
        <RestaurantPageMenu restaurant={restaurant} />
      </Suspense>
    </div>
  );
}
