import RestaurantPage from "@/app/ui/(main)/restaurant-page";
import { RestaurantPageSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { auth } from "../../../../../auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authData = await auth();

  return (
    <Suspense fallback={<RestaurantPageSkeleton />}>
      <RestaurantPage user={authData?.user} restaurantId={id} />
    </Suspense>
  );
}
