"use client";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/react";
import { Fragment } from "react";
import type { OrderAnalytics } from "@/lib/definitions";
import { formatNumber, formatPrice } from "@/lib/format";

const orderAnalyticsCards: { id: keyof OrderAnalytics; text: string }[] = [
  { id: "row_count_orders", text: "Total orders" },
  { id: "unique_restaurant_count", text: "Restaurants" },
  { id: "total_quantity", text: "Total items" },
  { id: "total_sum", text: "Total spent" },
];

type Props = {
  orderAnalytics: OrderAnalytics;
};

export default function OrdersAnalyticsContent({ orderAnalytics }: Props) {
  return (
    <Fragment>
      <div className="flex items-center gap-3">
        <Card shadow="sm">
          <CardBody>
            <ClipboardDocumentListIcon className="size-6" />
          </CardBody>
        </Card>
        <h1 className="text-xl font-semibold">Your orders</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {orderAnalyticsCards.map(({ id, text }) => {
          return (
            <Card key={id} shadow="sm">
              <CardBody>
                <p className="text-lg font-semibold">
                  {id === "total_sum"
                    ? formatPrice(orderAnalytics[id] || 0)
                    : formatNumber(orderAnalytics[id] || 0)}
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
