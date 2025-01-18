import { fetchOrders } from "@/app/lib/data";
import OrdersInfoContent from "./orders-info-content";

export default async function OrdersInfo({ userId }: { userId: string | null }) {
  const orders = await fetchOrders(userId);
  return <OrdersInfoContent orders={orders} />;
}
