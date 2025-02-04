import Image from "next/image";
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
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 py-16">
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
              priority
              width={0}
              height={0}
              sizes="100vw"
              src="/img/hero-food.webp"
              alt="Delicious food delivery"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              className="rounded-lg shadow-lg w-full h-[300px] object-cover"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-8 lg:w-2/4 lg:px-0 mx-auto">
        <Search />
      </div>

      <h1 className="text-center text-2xl font-semibold">Restaurants</h1>
      <Suspense fallback={<RestaurantsSkeleton />}>
        <Restaurants search={search} />
      </Suspense>
    </div>
  );
}
