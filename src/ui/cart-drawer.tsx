"use client";

import {
  BuildingStorefrontIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  addToast,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Image,
  Tab,
  Tabs,
} from "@heroui/react";
import NextImage from "next/image";
import Link from "next/link";
import {
  Fragment,
  type Key,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import {
  changeCartItemQuantity,
  completeCheckout,
  removeFromCart,
} from "../lib/actions";
import { DELIVERY_FEE } from "../lib/constants";
import type { CartData } from "../lib/definitions";
import { formatPrice } from "../lib/format";
import RatingStars from "./rating-stars";

const MOTION_PROPS = {
  variants: {
    enter: {
      opacity: 1,
      x: 0,
      duration: 0.3,
    },
    exit: {
      x: 100,
      opacity: 0,
      duration: 0.3,
    },
  },
};

const MAX_QUANTITY = 99;

type CartChange =
  | { type: "quantity"; itemId: string; delta: number }
  | { type: "remove"; itemId: string };

const applyChange = (cart: CartData[], change: CartChange): CartData[] =>
  cart
    .map((restaurant) => ({
      ...restaurant,
      items: restaurant.items.flatMap((item) => {
        if (item.id !== change.itemId) return [item];
        if (change.type === "remove") return [];
        const amount = Math.min(
          MAX_QUANTITY,
          Math.max(1, item.amount + change.delta),
        );
        return [{ ...item, amount, price: item.unitPrice * amount }];
      }),
    }))
    .filter((restaurant) => restaurant.items.length > 0);

type Props = {
  isOpen: boolean;
  cartData?: CartData[];
  onClose: () => void;
  onOpenChange: () => void;
};

export default function CartDrawer({
  isOpen,
  cartData = [],
  onClose,
  onOpenChange,
}: Props) {
  const [cart, applyOptimistic] = useOptimistic(cartData, applyChange);
  const [, startTransition] = useTransition();
  const [isCheckingOut, startCheckout] = useTransition();
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const selectedRestaurant =
    cart.find((restaurant) => restaurant.restaurantId === selectedKey) ??
    cart[0];

  const change = (cartChange: CartChange, action: () => Promise<void>) =>
    startTransition(async () => {
      applyOptimistic(cartChange);
      try {
        await action();
      } catch (error) {
        console.error("Failed to update cart:", error);
        addToast({
          title: "Couldn't update your cart",
          description: "Please try again.",
          color: "danger",
        });
      }
    });

  const changeQuantity = (itemId: string, delta: number) =>
    change({ type: "quantity", itemId, delta }, () =>
      changeCartItemQuantity(itemId, delta),
    );

  const removeItem = (itemId: string) =>
    change({ type: "remove", itemId }, () => removeFromCart(itemId));

  const subTotal =
    selectedRestaurant?.items.reduce((sum, item) => sum + item.price, 0) ?? 0;
  const total = subTotal ? subTotal + DELIVERY_FEE : 0;

  const handleCheckout = () => {
    if (!selectedRestaurant) return;
    const { restaurantId, restaurantName } = selectedRestaurant;
    startCheckout(async () => {
      try {
        await completeCheckout(restaurantId);
        onClose();
        addToast({
          title: "Order placed",
          description: `Your order from ${restaurantName} is on its way.`,
          color: "primary",
          severity: "success",
          endContent: (
            <Button
              as={Link}
              href="/orders"
              size="sm"
              variant="flat"
              color="primary"
              className="shrink-0"
            >
              View orders
            </Button>
          ),
        });
      } catch (error) {
        console.error("Failed to complete checkout:", error);
        addToast({
          title: "Couldn't place your order",
          description: "Please try again.",
          color: "danger",
        });
      }
    });
  };

  return (
    <Drawer
      classNames={{ wrapper: "cart-drawer" }}
      backdrop="blur"
      isOpen={isOpen}
      motionProps={MOTION_PROPS}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">Your items</DrawerHeader>
        <DrawerBody>
          {!cart.length ? (
            <div className="flex flex-col items-center mt-10 gap-1">
              <ShoppingBagIcon className="size-10 text-default-400" />
              <p className="text-center text-default-500 pt-2">
                Your cart is empty
              </p>
              <p className="text-center text-default-500">
                Add items to get started
              </p>
            </div>
          ) : (
            <Tabs
              aria-label="Dynamic tabs"
              items={cart}
              size="sm"
              selectedKey={selectedRestaurant?.restaurantId}
              onSelectionChange={setSelectedKey}
            >
              {cart.map(
                ({
                  restaurantId,
                  restaurantName,
                  restaurantAddress,
                  restaurantRating,
                  image,
                  items,
                }) => (
                  <Tab
                    key={restaurantId}
                    title={
                      <div className="flex items-center space-x-2">
                        <BuildingStorefrontIcon className="size-5" />
                        <span>{restaurantName}</span>
                      </div>
                    }
                  >
                    <div className="flex w-full items-center pt-5 gap-6">
                      <Image
                        as={NextImage}
                        removeWrapper
                        isBlurred
                        width={100}
                        height={100}
                        alt="Restaurant logo"
                        className="aspect-square object-cover"
                        src={image}
                      />
                      <div className="flex flex-col">
                        <h1 className="text-lg font-semibold">
                          {restaurantName}
                        </h1>
                        <p className="text-sm text-default-500">
                          {restaurantAddress}
                        </p>
                        <div className="flex items-center pt-1">
                          <RatingStars rating={restaurantRating} />
                          <p className="pl-2 text-sm font-semibold text-default-500">
                            {restaurantRating}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-7">
                      {items.map((cartItem) => (
                        <Card
                          key={cartItem.id}
                          shadow="none"
                          className="border"
                        >
                          <CardBody>
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-2">
                                <NextImage
                                  width={50}
                                  height={50}
                                  alt=""
                                  className="aspect-square rounded-small object-cover"
                                  src={cartItem.image}
                                />
                                <p className="text-xs text-default-500">
                                  {cartItem.name}
                                </p>
                              </div>
                              <div className="flex items-center justify-end gap-3">
                                <p className="text-default-500 text-sm">
                                  {formatPrice(cartItem.price)}
                                </p>
                                <ButtonGroup size="sm" variant="flat">
                                  <Button
                                    disableRipple
                                    isIconOnly
                                    aria-label={`Decrease ${cartItem.name} quantity`}
                                    isDisabled={cartItem.amount <= 1}
                                    onPress={() =>
                                      changeQuantity(cartItem.id, -1)
                                    }
                                  >
                                    <MinusIcon className="size-4" />
                                  </Button>
                                  <Button
                                    disableRipple
                                    isDisabled
                                    className=" text-md"
                                    isIconOnly
                                    aria-label={`${cartItem.name} quantity: ${cartItem.amount}`}
                                  >
                                    {cartItem.amount}
                                  </Button>
                                  <Button
                                    disableRipple
                                    isIconOnly
                                    aria-label={`Increase ${cartItem.name} quantity`}
                                    isDisabled={cartItem.amount >= MAX_QUANTITY}
                                    onPress={() =>
                                      changeQuantity(cartItem.id, 1)
                                    }
                                  >
                                    <PlusIcon className="size-4" />
                                  </Button>
                                </ButtonGroup>
                                <Button
                                  isIconOnly
                                  disableRipple
                                  size="sm"
                                  variant="flat"
                                  color="danger"
                                  aria-label={`Remove ${cartItem.name}`}
                                  onPress={() => removeItem(cartItem.id)}
                                >
                                  <TrashIcon className="size-5" />
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                      <div className="flex flex-col w-full gap-1 text-default-500 font-medium text-sm">
                        <div className="flex items-center justify-between">
                          <p>Subtotal:</p>
                          <p>{formatPrice(subTotal)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p>Delivery:</p>
                          <p>{formatPrice(DELIVERY_FEE)}</p>
                        </div>
                      </div>
                    </div>
                  </Tab>
                ),
              )}
            </Tabs>
          )}
        </DrawerBody>
        {!!cart.length && (
          <Fragment>
            <Divider />
            <DrawerFooter>
              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-default-600 font-semibold">Total:</p>
                  <p className="text-default-600 font-semibold">
                    {formatPrice(total)}
                  </p>
                </div>
                <Button
                  isLoading={isCheckingOut}
                  disableRipple
                  fullWidth
                  color="primary"
                  onPress={handleCheckout}
                >
                  Go to checkout
                </Button>
              </div>
            </DrawerFooter>
          </Fragment>
        )}
      </DrawerContent>
    </Drawer>
  );
}
