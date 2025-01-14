"use client";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { useActionState } from "react";

import { authenticate } from "../lib/actions";
import { LoginIcon } from "../ui/icons";

export default function Page() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex justify-end flex-col-reverse gap-4 lg:flex-row h-screen p-4 overflow-hidden">
      <div className="lg:w-6/12 flex flex-col items-center justify-center gap-5">
        <div className="border-1 border-gray-300 dark:border-gray-700 p-3 rounded-full shadow-lg">
          <LoginIcon />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-semibold text-2xl">Sign in to your account</h1>
          <p className="text-sm">Enter your details to sign in</p>
        </div>
        <form action={formAction} className="w-full lg:w-6/12 flex flex-col gap-4">
          <Input
            name="email"
            label="Email"
            type="email"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your email"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your password"
          />
          <Button isLoading={isPending} disableRipple type="submit" color="primary" aria-disabled={isPending}>
            Sign in
          </Button>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        </form>
      </div>
      <div className="h-40 lg:h-full lg:w-6/12 rounded-2xl border-1 overflow-hidden">
        <Image
          priority
          src="/login.webp"
          alt="Login"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
