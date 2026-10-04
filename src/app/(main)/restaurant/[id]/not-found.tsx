"use client";

import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-96" shadow="sm">
        <CardBody className="flex flex-col items-center gap-3 p-10">
          <BuildingStorefrontIcon className="size-20 text-default-400" />
          <h2 className="text-center font-semibold text-default-400">
            Restaurant not found
          </h2>
          <p className="text-center text-default-400">
            This restaurant doesn't exist or is no longer available.
          </p>
          <Button
            as={Link}
            href="/"
            disableRipple
            className="mt-2"
            color="primary"
          >
            Back to restaurants
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
