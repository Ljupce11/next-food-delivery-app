import { fetchOrders } from "@/lib/data";
import OrdersInfoContent from "./orders-info-content";

type Props = {
  userId: string | null;
};

export default async function OrdersInfo({ userId }: Props) {
  const orders = await fetchOrders(userId);
  return <OrdersInfoContent orders={orders} />;
}
