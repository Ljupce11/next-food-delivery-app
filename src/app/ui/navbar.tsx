"use client";

import {
  ArrowRightStartOnRectangleIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextNavbar,
  useDisclosure,
} from "@heroui/react";
import type { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type Key } from "react";

import Logo from "../../../public/logo.png";
import { signOutAction } from "../lib/actions";
import type { CartData } from "../lib/definitions";
import CartDrawer from "./cart-drawer";

export default function Navbar({ user, cartData }: { user?: User; cartData?: CartData[] }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const onDropdownActionHandler = (key: Key) => {
    switch (key) {
      case "logout":
        signOutAction();
        break;
      default:
        console.log(key);
    }
  };

  return (
    <NextNavbar isBordered shouldHideOnScroll>
      <NavbarBrand>
        <Link prefetch href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={Logo} className="h-8 w-8" alt="Flowbite Logo" />
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
        {user ? (
          <Fragment>
            <NavbarItem>
              <Button disableRipple isIconOnly aria-label="Cart" variant="light" onPress={onOpen}>
                <Badge
                  size="sm"
                  shape="circle"
                  color="primary"
                  content={cartData?.length}
                  style={{ fontSize: "0.6rem" }}
                  isInvisible={cartData?.length === 0}
                >
                  <ShoppingBagIcon className="size-6" />
                </Badge>
              </Button>
              <CartDrawer
                user={user}
                cartData={cartData}
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
              />
            </NavbarItem>
            <Dropdown backdrop="blur" placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  size="sm"
                  radius="lg"
                  as="button"
                  color="primary"
                  className="transition-transform"
                  name={typeof user.name === "string" ? user.name : ""}
                  showFallback={user.name === undefined}
                  fallback={<UserIcon className="size-4" strokeWidth={2.5} />}
                />
              </DropdownTrigger>
              <DropdownMenu
                onAction={onDropdownActionHandler}
                aria-label="Profile Actions"
                variant="flat"
                topContent={
                  <div className="flex items-center gap-4 px-2 py-2">
                    <Avatar
                      isDisabled
                      isBordered
                      size="sm"
                      as="button"
                      color="default"
                      className="transition-transform cursor-default"
                      radius="lg"
                      name={typeof user.name === "string" ? user.name : ""}
                      showFallback={user.name === undefined}
                      fallback={<UserIcon className="size-4" strokeWidth={2.5} />}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                }
              >
                <DropdownItem isReadOnly key="divider-one" startContent={<Divider />} textValue="divider-one" />
                <DropdownItem key="user-profile" startContent={<UserCircleIcon className="size-5" />}>
                  Profile
                </DropdownItem>
                <DropdownItem key="orders" startContent={<ClipboardDocumentListIcon className="size-5" />}>
                  Orders
                </DropdownItem>
                <DropdownItem key="favorites" startContent={<HeartIcon className="size-5" />}>
                  Favorites
                </DropdownItem>
                <DropdownItem isReadOnly key="divider-two" startContent={<Divider />} textValue="divider-two" />
                <DropdownItem key="help_and_feedback" startContent={<ChatBubbleLeftEllipsisIcon className="size-5" />}>
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={<ArrowRightStartOnRectangleIcon className="size-5" />}
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Fragment>
        ) : (
          <Fragment>
            <NavbarItem>
              <Link href="/login">Sign In</Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="bg-blue-100 rounded-xl px-3 py-2 text-blue-700" href="/sign-up">
                Sign up
              </Link>
            </NavbarItem>
          </Fragment>
        )}
      </NavbarContent>
    </NextNavbar>
  );
}
