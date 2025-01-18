"use client";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Fragment } from "react";

export function RestaurantsSkeleton() {
  return (
    <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 px-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={crypto.randomUUID()} isFooterBlurred className="border-none" shadow="none" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-48 rounded-lg bg-default-300" />
          </Skeleton>
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <div className="flex justify-between items-center w-full">
              <Skeleton className="w-2/5 rounded-xl">
                <div className="h-7 w-2/5 rounded-xl bg-default-200" />
              </Skeleton>
              <Skeleton className="w-2/5 rounded-xl">
                <div className="h-7 w-2/5 rounded-xl bg-default-200" />
              </Skeleton>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function OrderRestaurantDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-44">
      <Skeleton className="w-3/5 rounded-lg">
        <div className="h-5 w-3/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-5/5 rounded-lg">
        <div className="h-4 w-5/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-3/5 rounded-lg">
        <div className="h-4 w-3/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-2/5 rounded-lg">
        <div className="h-4 w-2/5 rounded-lg bg-default-200" />
      </Skeleton>
    </div>
  );
}

export function OrdersAnalyticsSkeleton() {
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
        {Array.from({ length: 4 }).map((_, index) => {
          const id = index + 1;
          return (
            <Card key={id} shadow="sm">
              <CardBody className="gap-2 py-4">
                <Skeleton className="w-5 h-5 rounded-lg">
                  <p className="w-5 h-5 rounded-lg font-semibold">0</p>
                </Skeleton>
                <Skeleton className="w-24 h-5 rounded-lg">
                  <p className="w-24 h-5 rounded-lg font-semibold">0</p>
                </Skeleton>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </Fragment>
  );
}

export function OrdersInfoSkeleton() {
  const columns = [
    { name: "RESTAURANT", uid: "restaurant_name" },
    { name: "DATE", uid: "order_date" },
    { name: "STATUS", uid: "status" },
    { name: "TOTAL", uid: "total" },
    { name: "DETAILS", uid: "details" },
  ];
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => {
          const id = index + 1;
          return (
            <TableRow key={id}>
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
                <Skeleton className="w-24 rounded-lg">
                  <div className="h-5 w-24 rounded-xl bg-default-200" />
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="w-24 rounded-lg">
                  <div className="h-5 w-24 rounded-xl bg-default-200" />
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="w-10 rounded-lg">
                  <div className="h-5 w-10 rounded-xl bg-default-200" />
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton className="w-8 rounded-lg">
                  <div className="h-8 w-8 rounded-xl bg-default-200" />
                </Skeleton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
