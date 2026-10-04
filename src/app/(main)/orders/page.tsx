import { Suspense } from "react";
import OrdersAnalytics from "@/ui/orders/orders-analytics";
import OrdersInfo from "@/ui/orders/orders-info";
import { OrdersAnalyticsSkeleton, OrdersInfoSkeleton } from "@/ui/skeletons";

export default function Page() {
  return (
    <div className="container flex flex-col gap-5 mx-auto p-4">
      <Suspense fallback={<OrdersAnalyticsSkeleton />}>
        <OrdersAnalytics />
      </Suspense>
      <Suspense fallback={<OrdersInfoSkeleton />}>
        <OrdersInfo />
      </Suspense>
    </div>
  );
}
