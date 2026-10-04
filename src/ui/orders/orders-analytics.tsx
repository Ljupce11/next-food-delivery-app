import { fetchOrderAnalytics } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import OrdersAnalyticsContent from "./orders-analytics-content";

export default async function OrdersAnalytics() {
  const user = await getCurrentUser();
  const orderAnalytics = await fetchOrderAnalytics(user?.id ?? null);
  return <OrdersAnalyticsContent orderAnalytics={orderAnalytics} />;
}
