"use client";

import { updateCartData } from "@/app/lib/actions";
import type { AdvancedUser, CartData, MenuItem, Restaurant } from "@/app/lib/definitions";
import {
  Button,
  ButtonGroup,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import RestaurantPageMenuContent from "./restaurant-page-menu-content";
import RestaurantPageSidebar from "./restaurant-page-sidebar";

type Props = {
  user?: AdvancedUser;
  restaurant: Restaurant;
  menuItems: MenuItem[];
};

export default function RestaurantPage({ user, restaurant, menuItems }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onAddToCartHandler = async () => {
    if (!user?.id) return;
    if (!selectedMenuItem) return;
    let updatedCartData: CartData[] = [];
    const existingCartData = user.cart;
    if (existingCartData) {
      updatedCartData = [...existingCartData];
      if (updatedCartData.length > 0) {
        const existingRestaurantIndex = updatedCartData.findIndex(
          (cartData) => cartData.restaurantId === restaurant.id,
        );
        if (existingRestaurantIndex !== -1) {
          if (updatedCartData[existingRestaurantIndex].items.length > 0) {
            if (updatedCartData[existingRestaurantIndex].items.some((item) => item.id === selectedMenuItem?.id)) {
              updatedCartData[existingRestaurantIndex].items.map((item) => {
                if (item.id === selectedMenuItem?.id) {
                  item.amount += 1;
                }
                return item;
              });
            } else {
              updatedCartData[existingRestaurantIndex].items.push({
                id: selectedMenuItem?.id,
                name: selectedMenuItem?.name || "",
                extra: "",
                price: selectedMenuItem?.price || 0,
                unitPrice: selectedMenuItem?.price || 0,
                amount: 1,
                image: selectedMenuItem?.image,
              });
            }
          }
        } else {
          updatedCartData.push({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantAddress: restaurant.address,
            image: restaurant.image,
            items: [
              {
                id: selectedMenuItem?.id,
                name: selectedMenuItem?.name || "",
                extra: "",
                price: selectedMenuItem?.price || 0,
                unitPrice: selectedMenuItem?.price || 0,
                amount: 1,
                image: selectedMenuItem?.image,
              },
            ],
          });
        }
      } else {
        updatedCartData.push({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantAddress: restaurant.address,
          image: restaurant.image,
          items: [
            {
              id: selectedMenuItem?.id,
              name: selectedMenuItem?.name || "",
              extra: "",
              price: selectedMenuItem?.price || 0,
              unitPrice: selectedMenuItem?.price || 0,
              amount: 1,
              image: selectedMenuItem?.image,
            },
          ],
        });
      }
    } else {
      updatedCartData.push({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        image: restaurant.image,
        items: [
          {
            id: selectedMenuItem?.id,
            name: selectedMenuItem?.name || "",
            extra: "",
            price: selectedMenuItem?.price || 0,
            unitPrice: selectedMenuItem?.price || 0,
            amount: 1,
            image: selectedMenuItem?.image,
          },
        ],
      });
    }
    setIsLoading(true);
    await updateCartData(user.id, updatedCartData, restaurant.id);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{selectedMenuItem?.name}</ModalHeader>
          <ModalBody>
            <Image height={200} width={"100%"} className="w-full object-cover" src={selectedMenuItem?.image} />
            <p>Some description about this menu item</p>
            <b>{selectedMenuItem?.price}kr</b>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <ButtonGroup variant="flat" color="primary">
              <Button disableRipple isIconOnly>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <title>Remove</title>
                  <path
                    fillRule="evenodd"
                    d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
              <Button disableRipple isDisabled className=" text-md" isIconOnly>
                {1}
              </Button>
              <Button disableRipple isIconOnly>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
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
              disableRipple
              isLoading={isLoading}
              spinnerPlacement="end"
              fullWidth
              color="primary"
              onPress={onAddToCartHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <title>Cart</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="font-semibold">Add to cart</p>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <RestaurantPageSidebar restaurant={restaurant} />
      <RestaurantPageMenuContent menuItems={menuItems} onOpen={onOpen} setSelectedMenuItem={setSelectedMenuItem} />
    </div>
  );
}
