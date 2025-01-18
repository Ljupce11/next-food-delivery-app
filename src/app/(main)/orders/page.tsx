import OrdersAnalytics from "@/app/ui/orders/orders-analytics";
import OrdersInfo from "@/app/ui/orders/orders-info";
import { OrdersAnalyticsSkeleton, OrdersInfoSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { auth } from "../../../../auth";

export default async function Page() {
  const authData = await auth();
  return (
    <div className="container flex flex-col gap-5 mx-auto p-4">
      <Suspense fallback={<OrdersAnalyticsSkeleton />}>
        <OrdersAnalytics userId={authData?.user?.id || null} />
      </Suspense>
      <Suspense fallback={<OrdersInfoSkeleton />}>
        <OrdersInfo userId={authData?.user?.id || null} />
      </Suspense>
    </div>
  );
}
