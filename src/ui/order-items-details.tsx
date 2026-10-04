"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import { useCallback } from "react";

import type { Order, OrderItem } from "../lib/definitions";
import { formatPrice } from "../lib/format";

const columns = [
  { name: "ITEM NAME", uid: "item_name" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "PRICE", uid: "price" },
];

export default function OrderItemsDetails({
  orderDetails,
}: {
  orderDetails: Order | null;
}) {
  const orderItems = orderDetails?.items ?? [];

  const renderCell = useCallback(
    (orderItem: OrderItem, columnKey: React.Key) => {
      const cellValue = orderItem[columnKey as keyof OrderItem];
      switch (columnKey) {
        case "item_name":
          return (
            <User
              avatarProps={{ radius: "lg", src: orderItem.item_image }}
              name={orderItem.name}
            />
          );
        case "price":
          return <p className="text-bold">{formatPrice(orderItem.price)}</p>;
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <Table removeWrapper isStriped isHeaderSticky aria-label="Item details">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={orderItems} emptyContent={"No order items found"}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
