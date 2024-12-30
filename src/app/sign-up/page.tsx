"use client";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-screen p-4 overflow-hidden">
      <div className="w-6/12 flex flex-col items-center justify-center gap-5">
        <div className="border-1 border-gray-300 dark:border-gray-700 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <title>Login</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-semibold text-2xl">Create a new account</h1>
          <p className="text-sm">Enter your details to sign up</p>
        </div>
        <form className="w-6/12 flex flex-col gap-4">
          <Input
            label="First name"
            type="text"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your first name"
          />
          <Input
            label="Last name"
            type="text"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your last name"
          />
          <Input
            label="Email"
            type="email"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            variant={"bordered"}
            labelPlacement="outside"
            placeholder="Enter your password"
          />
          <Button type="submit" color="primary">
            Sign in
          </Button>
        </form>
      </div>
      <div className="w-6/12 rounded-2xl border-1 overflow-hidden">
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
