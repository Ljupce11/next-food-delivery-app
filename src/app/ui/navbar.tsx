"use client";

import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextNavbar,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Key, Suspense, lazy, useEffect } from "react";

import { signOutAction } from "../lib/actions";
import type { AdvancedUser, CartData } from "../lib/definitions";
import { useUserStore } from "../lib/stores/userStore";
import NavbarButtons from "./navbar-buttons";

const LazyHelpFeedbackModal = lazy(
  () => import("./modals/help-feedback-modal"),
);

type Props = {
  user?: AdvancedUser;
};

export default function Navbar({ user }: Props) {
  const cartData: CartData[] = user?.cart || [];
  const router = useRouter();
  const {
    isOpen: isContactOpen,
    onOpen: onOpenContact,
    onOpenChange: onOpenChangeContact,
  } = useDisclosure();
  const setUserData = useUserStore((state) => state.setUserData);

  useEffect(() => {
    setUserData(user || null);
  }, [user, setUserData]);

  const onDropdownActionHandler = (key: Key) => {
    switch (key) {
      case "logout":
        signOutAction();
        break;
      case "help_and_feedback":
        onOpenContact();
        break;
      case "orders":
        router.push("/orders");
        break;
      case "user-profile":
        router.push("/profile");
        break;
      default:
        console.log(key);
    }
  };

  return (
    <NextNavbar isBordered shouldHideOnScroll>
      <Suspense fallback={null}>
        <LazyHelpFeedbackModal
          isOpen={isContactOpen}
          onOpenChange={onOpenChangeContact}
        />
      </Suspense>
      <NavbarBrand>
        <Link
          prefetch
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            className="h-8 w-8"
            src="/img/logo.png"
            alt="Food delivery logo"
          />
          <p className="self-center text-2xl font-semibold whitespace-nowrap hidden sm:flex dark:text-white">
            Food delivery
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarButtons
          user={user}
          cartData={cartData}
          onDropdownActionHandler={onDropdownActionHandler}
        />
      </NavbarContent>
    </NextNavbar>
  );
}
