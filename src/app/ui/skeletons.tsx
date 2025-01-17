"use client";

import { Card, CardFooter, Skeleton } from "@heroui/react";

export default function RestaurantsSkeleton() {
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
