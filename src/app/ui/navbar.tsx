"use client";

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
} from "@nextui-org/react";
import type { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type Key } from "react";

import Logo from "../../../public/logo.png";
import { signOutAction } from "../lib/actions";
import type { CartData } from "../lib/definitions";
import CartDrawer from "./cart-drawer";
import {
  CartIcon,
  FavoritesIcon,
  FeedbackIcon,
  LogoutIcon,
  OrdersIcon,
  ProfileIcon,
  UserAvatarFallbackIcon,
} from "./icons";

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
                  <CartIcon />
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
                  as="button"
                  color="default"
                  className="transition-transform"
                  radius="lg"
                  name={typeof user.name === "string" ? user.name : ""}
                  showFallback={user.name === undefined}
                  fallback={<UserAvatarFallbackIcon />}
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
                      fallback={<UserAvatarFallbackIcon />}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                }
              >
                <DropdownItem isReadOnly key="divider-one" startContent={<Divider />} textValue="divider-one" />
                <DropdownItem key="user-profile" startContent={<ProfileIcon />}>
                  Profile
                </DropdownItem>
                <DropdownItem key="orders" startContent={<OrdersIcon />}>
                  Orders
                </DropdownItem>
                <DropdownItem key="favorites" startContent={<FavoritesIcon />}>
                  Favorites
                </DropdownItem>
                <DropdownItem isReadOnly key="divider-two" startContent={<Divider />} textValue="divider-two" />
                <DropdownItem key="help_and_feedback" startContent={<FeedbackIcon />}>
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" startContent={<LogoutIcon />} color="danger">
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
