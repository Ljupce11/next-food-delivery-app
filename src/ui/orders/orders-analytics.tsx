import { fetchOrderAnalytics } from "@/lib/data";
import OrdersAnalyticsContent from "./orders-analytics-content";

type Props = {
  userId: string | null;
};

export default async function OrdersAnalytics({ userId }: Props) {
  const orderAnalytics = await fetchOrderAnalytics(userId);
  return <OrdersAnalyticsContent orderAnalytics={orderAnalytics} />;
}
