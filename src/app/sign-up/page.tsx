"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { Fragment, Suspense, lazy, useActionState, useEffect, useState } from "react";
import type { z } from "zod";

import { signUp } from "../lib/actions";
import type { signUpSchema } from "../lib/schemas";

const LazySignUpModal = lazy(() => import("../ui/modals/sign-up-modal"));

type FormData = z.infer<typeof signUpSchema>;

export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, formAction, isPending] = useActionState(signUp, { success: false, message: "" });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (state.success) {
      onOpen();
    } else {
      setFormErrors(state.errors || {});
    }
  }, [state, onOpen]);

  return (
    <Fragment>
      <Suspense fallback={null}>
        <LazySignUpModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </Suspense>
      <div className="flex justify-end flex-col-reverse gap-4 lg:flex-row h-screen p-4 overflow-hidden">
        <div className="lg:w-6/12 flex flex-col items-center justify-center gap-5">
          <div className="border border-gray-100 dark:border-gray-700 p-3 rounded-full shadow-md">
            <UserIcon className="size-6" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-semibold text-2xl">Create a new account</h1>
            <p className="text-sm">Enter your details to sign up</p>
          </div>
          <Form
            action={formAction}
            validationErrors={formErrors}
            validationBehavior="native"
            className="w-full lg:w-6/12 flex flex-col gap-4"
          >
            <Input
              isRequired
              label="First name"
              name="first_name"
              type="text"
              variant={"bordered"}
              labelPlacement="outside"
              placeholder="Enter your first name"
            />
            <Input
              isRequired
              label="Last name"
              name="last_name"
              type="text"
              variant={"bordered"}
              labelPlacement="outside"
              placeholder="Enter your last name"
            />
            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              variant={"bordered"}
              labelPlacement="outside"
              placeholder="Enter your email"
            />
            <Input
              isRequired
              label="Password"
              name="password"
              type="password"
              variant={"bordered"}
              labelPlacement="outside"
              placeholder="Enter your password"
            />
            <Button fullWidth isLoading={isPending} disableRipple type="submit" color="primary">
              Sign up
            </Button>
          </Form>
        </div>
        <div className="h-40 lg:h-full lg:w-6/12 rounded-2xl border-1 overflow-hidden">
          <Image
            priority
            src="/login.webp"
            alt="Sign Up"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </Fragment>
  );
}
