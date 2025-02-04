"use client";

import type { OrderAnalytics } from "@/lib/definitions";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@heroui/react";
import { motion } from "motion/react";
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
      <div className="flex items-center gap-3">
        <Card shadow="sm">
          <CardBody>
            <ClipboardDocumentListIcon className="size-6" />
          </CardBody>
        </Card>
        <h1 className="text-xl font-semibold">Your orders</h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {orderAnalyticsData.map(({ id, value, text }) => {
          return (
            <Card key={id} shadow="sm">
              <CardBody>
                <p className="text-lg font-semibold">
                  {value}
                  {id === "total_sum" && "kr"}
                </p>
                <p>{text}</p>
              </CardBody>
            </Card>
          );
        })}
      </motion.div>
    </Fragment>
  );
}
