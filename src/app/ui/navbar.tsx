"use client";

import { NavbarBrand, NavbarContent, Navbar as NextNavbar, useDisclosure } from "@heroui/react";
import type { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Key, Suspense, lazy } from "react";

import Logo from "../../../public/logo.png";
import { signOutAction } from "../lib/actions";
import type { CartData } from "../lib/definitions";
import NavbarButtons from "./navbar-buttons";

const LazyHelpFeedbackModal = lazy(() => import("./modals/help-feedback-modal"));

type Props = {
  user?: User;
  cartData?: CartData[];
};

export default function Navbar({ user, cartData }: Props) {
  const router = useRouter();
  const { isOpen: isContactOpen, onOpen: onOpenContact, onOpenChange: onOpenChangeContact } = useDisclosure();

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
      default:
        console.log(key);
    }
  };

  return (
    <NextNavbar isBordered shouldHideOnScroll>
      <Suspense fallback={null}>
        <LazyHelpFeedbackModal isOpen={isContactOpen} onOpenChange={onOpenChangeContact} />
      </Suspense>
      <NavbarBrand>
        <Link prefetch href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={Logo} className="h-8 w-8" alt="Food delivery" />
          <p className="self-center text-2xl font-semibold whitespace-nowrap hidden sm:flex dark:text-white">
            Food delivery
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Search />
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarButtons user={user} cartData={cartData} onDropdownActionHandler={onDropdownActionHandler} />
      </NavbarContent>
    </NextNavbar>
  );
}
