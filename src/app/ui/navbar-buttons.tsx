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
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
  useDisclosure,
} from "@heroui/react";
import type { User } from "next-auth";
import Link from "next/link";
import { Fragment, type Key, Suspense, lazy } from "react";

import type { CartData } from "../lib/definitions";

const LazyCartDrawer = lazy(() => import("./cart-drawer"));

type Props = {
  user?: User;
  cartData?: CartData[];
  onDropdownActionHandler: (key: Key) => void;
};

export default function NavbarButtons({ user, cartData, onDropdownActionHandler }: Props) {
  const {
    isOpen: isCartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart,
    onOpenChange: onOpenChangeCart,
  } = useDisclosure();

  if (user) {
    return (
      <Fragment>
        <NavbarItem>
          <Button disableRipple isIconOnly aria-label="Cart" variant="light" onPress={onOpenCart}>
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
          <Suspense fallback={null}>
            <LazyCartDrawer
              user={user}
              cartData={cartData}
              isOpen={isCartOpen}
              onClose={onCloseCart}
              onOpenChange={onOpenChangeCart}
            />
          </Suspense>
        </NavbarItem>
        <NavbarItem>
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
              variant="flat"
              aria-label="Profile Actions"
              onAction={onDropdownActionHandler}
              disabledKeys={["user-profile", "favorites"]}
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
              <DropdownItem
                key="user-profile"
                startContent={<UserCircleIcon className="size-5" />}
                endContent={
                  <Chip variant="flat" color="secondary" size="sm">
                    Coming soon
                  </Chip>
                }
              >
                Profile
              </DropdownItem>
              <DropdownItem key="orders" startContent={<ClipboardDocumentListIcon className="size-5" />}>
                Orders
              </DropdownItem>
              <DropdownItem
                key="favorites"
                startContent={<HeartIcon className="size-5" />}
                endContent={
                  <Chip variant="flat" color="secondary" size="sm">
                    Coming soon
                  </Chip>
                }
              >
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
        </NavbarItem>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <NavbarItem>
        <Link href="/login">Sign In</Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/sign-up" className="bg-blue-100 rounded-xl px-3 py-2 text-blue-700">
          Sign up
        </Link>
      </NavbarItem>
    </Fragment>
  );
}
