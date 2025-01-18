"use client";

import { Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { fetchOrderItems } from "../lib/actions";
import type { Order, OrderItem } from "../lib/definitions";

export const columns = [
  { name: "ITEM NAME", uid: "item_name" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "PRICE", uid: "price" },
];

export default function OrderItemsDetails({ orderDetails }: { orderDetails: Order | null }) {
  const { id } = orderDetails || {};
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getOrderItems = async () => {
      if (id) {
        setIsLoading(true);
        const orderItems = await fetchOrderItems(id);
        setIsLoading(false);
        setOrderItems(orderItems);
      }
    };
    getOrderItems();
  }, [id]);

  const renderCell = useCallback((orderItem: OrderItem, columnKey: React.Key) => {
    const cellValue = orderItem[columnKey as keyof OrderItem];
    switch (columnKey) {
      case "item_name":
        return <User avatarProps={{ radius: "lg", src: orderItem.item_image }} name={orderItem.name} />;
      case "price":
        return <p className="text-bold">{cellValue}kr</p>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table removeWrapper isStriped aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={orderItems}>
        {isLoading ? (
          <TableRow key={1}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-xl">
                  <div className="h-10 w-10 rounded-xl bg-default-200" />
                </Skeleton>
                <Skeleton className="w-36 rounded-lg">
                  <div className="h-5 w-36 rounded-xl bg-default-200" />
                </Skeleton>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="w-8 rounded-lg">
                <div className="h-5 w-8 rounded-xl bg-default-200" />
              </Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-10 rounded-lg">
                <div className="h-5 w-10 rounded-xl bg-default-200" />
              </Skeleton>
            </TableCell>
          </TableRow>
        ) : (
          (item) => (
            <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
