import Image from "next/image";
import { Suspense } from "react";

import Restaurants from "../../ui/(main)/restaurants";
import Search, { SearchFallback } from "../../ui/(main)/search";
import { RestaurantsSkeleton } from "../../ui/skeletons";

type Props = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default function Page({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8 mb-20">
      <div className="bg-linear-to-r from-sky-50 via-blue-50 to-sky-50 py-16">
        <div className="w-full px-8 lg:w-3/4 lg:px-0 mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-left mb-8 lg:mb-0">
            <h1 className="text-4xl font-bold mb-4">
              Delicious Food, Delivered to Your Door
            </h1>
            <p className="text-gray-600 text-lg">
              Order from your favorite local restaurants with just a few clicks
            </p>
          </div>

          <div className="lg:w-1/2 lg:pl-8">
            <Image
              loading="eager"
              fetchPriority="high"
              width={1920}
              height={1273}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src="/img/hero-food.webp"
              alt="Delicious food delivery"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-8 lg:w-2/4 lg:px-0 mx-auto">
        <Suspense fallback={<SearchFallback />}>
          <Search />
        </Suspense>
      </div>

      <h1 className="text-center text-2xl font-semibold">Restaurants</h1>
      <Suspense fallback={<RestaurantsSkeleton />}>
        <Restaurants searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
