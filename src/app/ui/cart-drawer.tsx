"use client";

import { BuildingStorefrontIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
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
import { Fragment, type Key, useEffect, useState } from "react";
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
        heroUITemporaryFix();
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
    if (isOpen) {
      heroUITemporaryFix();
    }
    onOpenChange();
  };

  const heroUITemporaryFix = () => {
    // TEMPORARY FIX: Remove the drawer from the DOM after it's closed
    const childElement = document.querySelector(".cart-drawer");
    const parentElement = childElement?.parentElement;
    if (parentElement) {
      setTimeout(() => {
        parentElement.remove();
      }, 500);
    }
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
          {!cartData?.length ? (
            <div className="flex flex-col items-center mt-10 gap-1">
              <ShoppingBagIcon className="size-10 text-default-400" />
              <p className="text-center text-default-500 pt-2">Your cart is empty</p>
              <p className="text-center text-default-500">Add items to get started</p>
            </div>
          ) : (
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
                      <BuildingStorefrontIcon className="size-5" />
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
                        {Array.from({ length: 5 }).map((_, index) => {
                          const id = index + 1;
                          return <StarIcon key={id} className="size-4 text-yellow-400" />;
                        })}
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
                                  <MinusIcon className="size-4" />
                                </Button>
                                <Button disableRipple isDisabled className=" text-md" isIconOnly>
                                  {cartItem.amount}
                                </Button>
                                <Button disableRipple isIconOnly onPress={() => addRemoveItem(cartItem.id, "add")}>
                                  <PlusIcon className="size-4" />
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
          )}
        </DrawerBody>
        {!!cartData?.length && (
          <Fragment>
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
          </Fragment>
        )}
      </DrawerContent>
    </Drawer>
  );
}
