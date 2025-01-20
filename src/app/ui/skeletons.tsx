"use client";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { motion } from "motion/react";
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
    <Fragment>
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
    </Fragment>
  );
}

export function RestaurantPageMenuSkeleton() {
  return (
    <div className="w-full lg:w-3/4">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => {
          const id = index + 1;
          return (
            <Card disableRipple key={id} isPressable shadow="sm">
              <CardBody className="overflow-visible">
                <Skeleton className="rounded-xl">
                  <div style={{ height: "150px" }} className="w-full rounded-xl bg-default-200" />
                </Skeleton>
              </CardBody>
              <CardFooter className="pt-0 flex-col items-start gap-1">
                <Skeleton className="rounded-xl">
                  <div className="h-3 w-24 rounded-xl bg-default-200" />
                </Skeleton>
                <Skeleton className="rounded-xl">
                  <div className="h-3 w-48 rounded-xl bg-default-200" />
                </Skeleton>
                <Divider className="my-2.5" />
                <div className="flex items-center justify-between w-full text-sm">
                  <Skeleton className="rounded-xl">
                    <div className="h-5 w-10 rounded-xl bg-default-200" />
                  </Skeleton>
                  <Skeleton className="rounded-xl">
                    <div className="h-5 w-20 rounded-xl bg-default-200" />
                  </Skeleton>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function RestaurantPageSidebarSkeleton() {
  return (
    <div className="w-full lg:w-1/6 overflow-x-hidden pt-9">
      <div className="flex flex-col w-full items-center gap-6">
        <Skeleton className="rounded-xl">
          <div style={{ height: "100px", width: "100px" }} className="rounded-xl bg-default-200" />
        </Skeleton>
        <div className="flex flex-col items-center gap-2 mt-2">
          <Skeleton className="rounded-xl">
            <div className="h-5 w-28 rounded-xl bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-xl">
            <div className="h-4 w-44 rounded-xl bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-xl">
            <div className="h-4 w-28 rounded-xl bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-xl">
            <div className="h-4 w-20 rounded-xl bg-default-200" />
          </Skeleton>
          <Skeleton className="rounded-xl">
            <div className="h-4 w-28 rounded-xl bg-default-200" />
          </Skeleton>
        </div>
      </div>
      <Divider className="my-5" />
      <div className="flex justify-center w-full">
        <Skeleton className="w-full md:w-auto rounded-xl">
          <div className="h-10 w-full md:h-72 md:w-28 rounded-xl bg-default-200" />
        </Skeleton>
      </div>
    </div>
  );
}

export function RestaurantPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row"
    >
      <RestaurantPageSidebarSkeleton />
      <RestaurantPageMenuSkeleton />
    </motion.div>
  );
}
