"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody } from "@heroui/react";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen overflow-hidden items-center justify-center">
      <Card className="max-w-96" shadow="sm">
        <CardBody className="flex flex-col items-center gap-3 p-10">
          <ExclamationCircleIcon className="size-20 text-default-400" />
          <h2 className="text-center font-semibold text-default-400">
            Something went wrong!
          </h2>
          <p className="text-center text-default-400">
            Please try again. If the problem continues, come back a little
            later.
          </p>
          <Button
            disableRipple
            className="mt-2"
            color="primary"
            onPress={() => reset()}
          >
            Try again
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
