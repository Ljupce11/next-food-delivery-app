import { fetchOrders } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import OrdersInfoContent from "./orders-info-content";

export default async function OrdersInfo() {
  const user = await getCurrentUser();
  const orders = await fetchOrders(user?.id ?? null);
  return <OrdersInfoContent orders={orders} />;
}
