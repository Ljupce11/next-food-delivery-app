import { Suspense } from "react";

import { fetchRestaurant } from "@/app/lib/data";
import { RestaurantPageMenuSkeleton } from "../skeletons";
import RestaurantPageMenu from "./restaurant-page-menu";
import RestaurantPageSidebar from "./restaurant-page-sidebar";

type Props = {
  restaurantId: string;
};

export default async function RestaurantPage({ restaurantId }: Props) {
  const restaurant = await fetchRestaurant(restaurantId);
  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <RestaurantPageSidebar restaurant={restaurant} />
      <Suspense fallback={<RestaurantPageMenuSkeleton />}>
        <RestaurantPageMenu restaurant={restaurant} />
      </Suspense>
    </div>
  );
}
