import { fetchOrderAnalytics } from "@/app/lib/data";
import OrdersAnalyticsContent from "./orders-analytics-content";

export default async function OrdersAnalytics({ userId }: { userId: string | null }) {
  const orderAnalytics = await fetchOrderAnalytics(userId);
  return <OrdersAnalyticsContent orderAnalytics={orderAnalytics} />;
}
