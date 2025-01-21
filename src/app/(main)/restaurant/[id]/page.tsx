import { fetchRestaurant } from "@/app/lib/data";
import RestaurantPageMenu from "@/app/ui/(main)/restaurant-page-menu";
import RestaurantPageSidebar from "@/app/ui/(main)/restaurant-page-sidebar";
import { RestaurantPageMenuSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
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
