"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, useDisclosure } from "@heroui/react";
import Image from "next/image";
import {
  Fragment,
  lazy,
  Suspense,
  type SyntheticEvent,
  startTransition,
  useActionState,
} from "react";

import { signUp } from "../../lib/actions";

const LazySignUpModal = lazy(() => import("../../ui/modals/sign-up-modal"));

type SignUpState = Awaited<ReturnType<typeof signUp>>;

export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, formAction, isPending] = useActionState(
    async (prevState: SignUpState, formData: FormData) => {
      const result = await signUp(prevState, formData);
      if (result.success) {
        onOpen();
      }
      return result;
    },
    { success: false, message: "" },
  );

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <Fragment>
      {state.success && (
        <Suspense fallback={null}>
          <LazySignUpModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </Suspense>
      )}
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
            onSubmit={onSubmit}
            validationErrors={state.errors}
            validationBehavior="native"
            className="w-full lg:w-6/12 flex flex-col gap-4"
          >
            <Input
              isRequired
              label="First name"
              name="first_name"
              type="text"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your first name"
            />
            <Input
              isRequired
              label="Last name"
              name="last_name"
              type="text"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your last name"
            />
            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your email"
            />
            <Input
              isRequired
              label="Password"
              name="password"
              type="password"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your password"
            />
            {!state.success && state.message && (
              <div className="text-red-500 text-sm">{state.message}</div>
            )}
            <Button
              fullWidth
              disableRipple
              type="submit"
              color="primary"
              isLoading={isPending}
              aria-disabled={isPending}
            >
              Sign up
            </Button>
          </Form>
        </div>
        <div className="h-40 lg:h-full lg:w-6/12 rounded-2xl border-1 overflow-hidden">
          <Image
            priority
            src="/img/login/login.webp"
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
