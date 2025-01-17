"use client";

import {
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
import type { User } from "next-auth";
import { type Key, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateCartDataFromDrawer } from "../lib/actions";
import type { CartData } from "../lib/definitions";

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

const DELIVERY = 50;

type Props = {
  isOpen: boolean;
  user: User;
  cartData?: CartData[];
  onClose: () => void;
  onOpenChange: () => void;
};

export default function CartDrawer({ isOpen, user, cartData: existingCartData, onClose, onOpenChange }: Props) {
  const [cartData, setCartData] = useState(existingCartData);
  const [selectedRestaurantKey, setSelectedRestaurantKey] = useState<Key>("");
  const [isLoading, setIsLoading] = useState<{ id: string | null; state: boolean }>({ id: null, state: false });
  const selectedRestaurant = cartData?.find((restaurant) => restaurant.restaurantId === selectedRestaurantKey);

  useEffect(() => {
    if (existingCartData) {
      setCartData(existingCartData);
      if (selectedRestaurantKey === "") {
        setSelectedRestaurantKey(existingCartData.length > 0 ? existingCartData[0].restaurantId : "");
      }
    }
  }, [existingCartData, selectedRestaurantKey]);

  const addRemoveItem = (itemId: string, action: "add" | "remove") => {
    if (!cartData || !selectedRestaurant) return;
    const updatedCart = [...cartData].map((restaurant) => {
      if (restaurant.restaurantId === selectedRestaurant?.restaurantId) {
        return {
          ...restaurant,
          items: restaurant.items.map((item) => {
            if (item.id === itemId) {
              item.amount = action === "add" ? item.amount + 1 : item.amount > 1 ? item.amount - 1 : item.amount;
              return {
                ...item,
                price: Number(item.unitPrice) * item.amount,
              };
            }
            return item;
          }),
        };
      }
      return restaurant;
    });
    setCartData(updatedCart);
    updateCartDataWithDebounce(updatedCart);
  };

  const deleteItem = async (itemId: string) => {
    if (!cartData || !selectedRestaurant) return;
    let updatedCart: CartData[] = JSON.parse(JSON.stringify(cartData));
    const matchedRestaurant = updatedCart.find(
      (restaurant) => restaurant.restaurantId === selectedRestaurant?.restaurantId,
    );
    if (matchedRestaurant) {
      if (matchedRestaurant.items.length > 1) {
        matchedRestaurant.items = matchedRestaurant.items.filter((item) => item.id !== itemId);
      } else {
        updatedCart = updatedCart.filter((restaurant) => restaurant.restaurantId !== selectedRestaurant?.restaurantId);
      }
    }
    setIsLoading({ id: itemId, state: true });
    try {
      await updateCartDataFromDrawer(user.id || "", updatedCart);
      setIsLoading({ id: itemId, state: false });
      if (updatedCart.length === 0) {
        onClose();
      }
    } catch (error) {
      setIsLoading({ id: itemId, state: false });
      console.error("FAILED to update cart:", error);
      throw new Error("FAILED to update cart.");
    }
  };

  const updateCartDataWithDebounce = useDebouncedCallback(async (updatedCart: CartData[]) => {
    try {
      await updateCartDataFromDrawer(user.id || "", updatedCart);
    } catch (error) {
      console.error("FAILED to update cart:", error);
      throw new Error("FAILED to update cart.");
    }
  }, 300);

  const subTotal = cartData
    ?.find((restaurant) => restaurant.restaurantId === selectedRestaurant?.restaurantId)
    ?.items.reduce((acc, current) => {
      return acc + Number(current.price);
    }, 0);
  const total = subTotal ? subTotal + DELIVERY : 0;

  const onOpenChangeHandler = () => {
    // TEMPORARY FIX: Remove the drawer from the DOM after it's closed
    if (isOpen) {
      const childElement = document.querySelector(".cart-drawer");
      const parentElement = childElement?.parentElement;
      if (parentElement) {
        setTimeout(() => {
          parentElement.remove();
        }, 500);
      }
    }
    onOpenChange();
  };

  return (
    <Drawer
      classNames={{ wrapper: "cart-drawer" }}
      backdrop="blur"
      isOpen={isOpen}
      motionProps={MOTION_PROPS}
      onOpenChange={onOpenChangeHandler}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">Your items</DrawerHeader>
        <DrawerBody>
          {!cartData?.length && (
            <div className="flex flex-col items-center mt-10 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-10 text-default-400"
              >
                <title>Cart</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="text-center text-default-500 pt-2">Your cart is empty</p>
              <p className="text-center text-default-500">Add items to get started</p>
            </div>
          )}
          <Tabs
            aria-label="Dynamic tabs"
            items={cartData}
            size="sm"
            // @ts-expect-error
            selectedKey={selectedRestaurantKey}
            onSelectionChange={(e) => setSelectedRestaurantKey(e)}
          >
            {cartData?.map(({ restaurantId, restaurantName, restaurantAddress, image, items }) => (
              <Tab
                key={restaurantId}
                title={
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <title>Restaurant</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                      />
                    </svg>

                    <span>{restaurantName}</span>
                  </div>
                }
              >
                <div className="flex w-full items-center pt-5 gap-6">
                  <Image
                    isBlurred
                    src={image}
                    width={100}
                    height={100}
                    alt="Event image"
                    className="aspect-square object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold">{restaurantName}</h1>
                    <p className="text-sm text-default-500">{restaurantAddress}</p>
                    <div className="flex items-center pt-1">
                      {Array.from({ length: 5 }).map(() => (
                        <svg
                          key={self.crypto.randomUUID()}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4 text-yellow-400"
                        >
                          <title>Rating</title>
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-7">
                  {items.map((cartItem) => (
                    <Card key={cartItem.id} shadow="none" className="border">
                      <CardBody>
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Image
                              removeWrapper
                              width={50}
                              height={50}
                              src={cartItem.image}
                              className="aspect-square object-cover"
                            />
                            <div className="flex flex-col text-xs text-default-500">
                              <p>{cartItem.name}</p>
                              <p>Extra: {cartItem.extra}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-3">
                            <p className="text-default-500 text-sm">{cartItem.price}kr</p>
                            <ButtonGroup size="sm" variant="flat">
                              <Button disableRipple isIconOnly onPress={() => addRemoveItem(cartItem.id, "remove")}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-4"
                                >
                                  <title>Remove</title>
                                  <path
                                    fillRule="evenodd"
                                    d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Button>
                              <Button disableRipple isDisabled className=" text-md" isIconOnly>
                                {cartItem.amount}
                              </Button>
                              <Button disableRipple isIconOnly onPress={() => addRemoveItem(cartItem.id, "add")}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-4"
                                >
                                  <title>Add</title>
                                  <path
                                    fillRule="evenodd"
                                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Button>
                            </ButtonGroup>
                            <Button
                              isIconOnly
                              disableRipple
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() => deleteItem(cartItem.id)}
                              isLoading={isLoading.state === true && isLoading.id === cartItem.id}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                              >
                                <title>Delete</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                  <div className="flex flex-col w-full gap-1 text-default-500 font-medium text-sm">
                    <div className="flex items-center justify-between">
                      <p>Subtotal:</p>
                      <p>{subTotal}kr</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Delivery:</p>
                      <p>50kr</p>
                    </div>
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between">
              <p className="text-default-600 font-semibold">Total:</p>
              <p className="text-default-600 font-semibold">{total}kr</p>
            </div>
            <Button disableRipple fullWidth color="primary" onPress={() => {}}>
              Go to checkout
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
