"use client";

import type { OrderAnalytics } from "@/app/lib/definitions";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/react";
import { Fragment } from "react";

const orderAnalyticsInitialData = [
  { id: "row_count_orders", value: "0", text: "Total orders" },
  { id: "unique_restaurant_count", value: "0", text: "Restaurants" },
  { id: "total_quantity", value: "0", text: "Total items" },
  { id: "total_sum", value: "0", text: "Total spent" },
];

type Props = {
  orderAnalytics: OrderAnalytics;
};

export default function OrdersAnalyticsContent({ orderAnalytics }: Props) {
  const orderAnalyticsData = [...orderAnalyticsInitialData];
  orderAnalyticsData.forEach((data) => {
    const orderData = orderAnalytics[data.id as keyof OrderAnalytics];
    data.value = orderData || "0";
  });

  return (
    <Fragment>
      <div className="flex items-center justify-center md:justify-start gap-3">
        <Card shadow="sm">
          <CardBody>
            <ClipboardDocumentListIcon className="size-6" />
          </CardBody>
        </Card>
        <h1 className="text-xl font-semibold">Your orders</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {orderAnalyticsData.map(({ id, value, text }) => {
          return (
            <Card key={id} shadow="sm">
              <CardBody>
                <p className="text-lg font-semibold">
                  {value}
                  {id === "totalSpent" && "kr"}
                </p>
                <p>{text}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </Fragment>
  );
}
