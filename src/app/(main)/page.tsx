import { Suspense } from "react";

import Restaurants from "../ui/(main)/restaurants";
import Search from "../ui/(main)/search";
import RestaurantsSkeleton from "../ui/skeletons";

export default async function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-2/4 mx-auto mt-5">
        <Search />
      </div>
      <h1 className="text-center text-2xl font-semibold">Restaurants</h1>
      <Suspense fallback={<RestaurantsSkeleton />}>
        <Restaurants />
      </Suspense>
    </div>
  );
}
