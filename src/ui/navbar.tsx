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
import { type Key, lazy, Suspense, useState } from "react";

import { signOutAction } from "../lib/actions";
import type { AdvancedUser, CartData } from "../lib/definitions";
import NavbarButtons from "./navbar-buttons";

const LazyHelpFeedbackModal = lazy(
  () => import("./modals/help-feedback-modal"),
);

type Props = {
  user?: AdvancedUser;
  isLoading?: boolean;
};

export default function Navbar({ user, isLoading = false }: Props) {
  const cartData: CartData[] = user?.cart || [];
  const router = useRouter();
  const {
    isOpen: isContactOpen,
    onOpen: onOpenContact,
    onOpenChange: onOpenChangeContact,
  } = useDisclosure();
  const [hasOpenedContact, setHasOpenedContact] = useState(false);

  const onDropdownActionHandler = (key: Key) => {
    switch (key) {
      case "logout":
        signOutAction();
        break;
      case "help_and_feedback":
        setHasOpenedContact(true);
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
    <NextNavbar isBordered>
      {hasOpenedContact && (
        <Suspense fallback={null}>
          <LazyHelpFeedbackModal
            isOpen={isContactOpen}
            onOpenChange={onOpenChangeContact}
          />
        </Suspense>
      )}
      <NavbarBrand>
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            width={32}
            height={32}
            loading="eager"
            className="size-8 object-contain"
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
          isLoading={isLoading}
          user={user}
          cartData={cartData}
          onDropdownActionHandler={onDropdownActionHandler}
        />
      </NavbarContent>
    </NextNavbar>
  );
}
