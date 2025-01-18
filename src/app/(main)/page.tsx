import { Suspense } from "react";

import Restaurants from "../ui/(main)/restaurants";
import Search from "../ui/(main)/search";
import { RestaurantsSkeleton } from "../ui/skeletons";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";

  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="w-full px-8 lg:w-2/4 lg:px-0 mx-auto mt-5">
        <Search />
      </div>
      <h1 className="text-center text-2xl font-semibold">Restaurants</h1>
      <Suspense fallback={<RestaurantsSkeleton />}>
        <Restaurants search={search} />
      </Suspense>
    </div>
  );
}
