import { fetchOrders } from "@/app/lib/data";
import OrdersContent from "@/app/ui/orders";
import { auth } from "../../../../auth";

export default async function Page() {
  const authData = await auth();
  const orders = await fetchOrders(authData?.user?.id || "");
  return <OrdersContent orders={orders} />;
}
