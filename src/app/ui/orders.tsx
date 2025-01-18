"use client";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  Chip,
  type ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  useDisclosure,
} from "@heroui/react";
import React, { Fragment, useCallback } from "react";
import type { Order } from "../lib/definitions";
import OrderDetailsModal from "./modals/order-details-modal";

export const columns = [
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

export default function OrdersContent({ orders }: { orders: Order[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalDetails, setModalDetails] = React.useState<Order | null>(null);

  const onOpenModalHandler = useCallback(
    (order: Order) => {
      setModalDetails(order);
      onOpen();
    },
    [onOpen],
  );

  const renderCell = useCallback(
    (order: Order, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof Order];

      switch (columnKey) {
        case "restaurant_name":
          return (
            <User avatarProps={{ radius: "lg", src: order.restaurant_avatar }} name={cellValue}>
              {order.restaurant_name}
            </User>
          );
        case "order_date": {
          const date = new Date();
          const options = { year: "numeric" as const, month: "2-digit" as const, day: "2-digit" as const };
          const orderDate = date.toLocaleDateString("sv-SE", options);
          return <p className="text-bold text-sm capitalize">{orderDate}</p>;
        }
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[order.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        case "total":
          return <p className="text-bold">{cellValue}kr</p>;
        case "details":
          return (
            <Button onPress={() => onOpenModalHandler(order)} size="sm" variant="flat" isIconOnly disableRipple>
              <ClipboardDocumentListIcon className="size-5" />
            </Button>
          );
        default:
          return cellValue;
      }
    },
    [onOpenModalHandler],
  );

  return (
    <Fragment>
      <OrderDetailsModal modalDetails={modalDetails} isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="container flex flex-col gap-5 mx-auto p-4">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <Card shadow="sm">
            <CardBody>
              <ClipboardDocumentListIcon className="size-6" />
            </CardBody>
          </Card>
          <h1 className="text-xl font-semibold">Your orders</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => {
            const id = i + 1;
            return (
              <Card key={id} shadow="sm">
                <CardBody>
                  <p className="text-lg font-semibold">27</p>
                  <p>Total Orders</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
        <Table isStriped aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "details" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={orders} emptyContent={"You haven't made any orders yet"}>
            {(item) => (
              <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}
