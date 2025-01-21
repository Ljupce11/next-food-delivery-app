"use client";

import { completeOrder } from "@/app/lib/actions";
import type { Order } from "@/app/lib/definitions";
import { CheckCircleIcon, ClipboardDocumentListIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Chip,
  type ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
  useDisclosure,
} from "@heroui/react";
import { motion } from "motion/react";
import { Suspense, lazy, useCallback, useState } from "react";

const LazyOrderDetailsModal = lazy(() => import("../modals/order-details-modal"));

const columns = [
  { name: "RESTAURANT", uid: "restaurant_name" },
  { name: "DATE", uid: "order_date" },
  { name: "STATUS", uid: "status" },
  { name: "TOTAL", uid: "total" },
  { name: "DETAILS", uid: "details" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  "In Progress": "primary",
  Delivered: "success",
};

type Props = {
  orders: Order[];
};
export default function OrdersInfoContent({ orders }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalDetails, setModalDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<{ id: string | null; state: boolean }>({ id: null, state: false });

  const onOpenModalHandler = useCallback(
    (order: Order) => {
      setModalDetails(order);
      onOpen();
    },
    [onOpen],
  );

  const completeOrderHandler = useCallback(async (orderId: string) => {
    setIsLoading({ id: orderId, state: true });
    try {
      await completeOrder(orderId);
    } catch (error) {
      setIsLoading({ id: null, state: false });
      console.error(error);
      throw new Error("Failed to complete order");
    }
  }, []);

  const DateCell = ({ order }: { order: Order }) => {
    const date = new Date(order.order_date);
    const options = {
      year: "numeric" as const,
      month: "2-digit" as const,
      day: "2-digit" as const,
      hour: "2-digit" as const,
      minute: "2-digit" as const,
      hour12: false,
    };
    const orderDate = date.toLocaleDateString("sv-SE", options);
    return <p className="text-bold text-sm capitalize">{orderDate}</p>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Suspense fallback={null}>
        <LazyOrderDetailsModal modalDetails={modalDetails} isOpen={isOpen} onOpenChange={onOpenChange} />
      </Suspense>
      <Table isStriped aria-label="Orders table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn scope="col" key={column.uid} align={column.uid === "details" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"You haven't made any orders yet"}>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <User avatarProps={{ radius: "lg", src: order.restaurant_avatar }} name={order.restaurant_name}>
                  {order.restaurant_name}
                </User>
              </TableCell>
              <TableCell>
                <DateCell order={order} />
              </TableCell>
              <TableCell>
                <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
                  <div className="flex items-center gap-1">
                    {order.status === "In Progress" ? (
                      <ClockIcon className="size-4" />
                    ) : (
                      <CheckCircleIcon className="size-4" />
                    )}
                    {order.status}
                  </div>
                </Chip>
              </TableCell>
              <TableCell>
                <p className="text-bold">{order.total}kr</p>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center w-full gap-2">
                  <Tooltip size="sm" color="foreground" content="Complete order">
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      isIconOnly
                      disableRipple
                      aria-label="Complete order"
                      isLoading={isLoading.id === order.id && isLoading.state}
                      onPress={() => completeOrderHandler(order.id)}
                      className={`${order.status === "In Progress" ? "visible" : "invisible"}`}
                    >
                      <CheckCircleIcon className="size-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip size="sm" color="foreground" content="More info">
                    <Button
                      size="sm"
                      variant="flat"
                      isIconOnly
                      disableRipple
                      aria-label="View more information"
                      onPress={() => onOpenModalHandler(order)}
                    >
                      <ClipboardDocumentListIcon className="size-5" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
