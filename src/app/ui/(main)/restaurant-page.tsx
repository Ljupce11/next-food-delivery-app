"use client";

import { updateCartData } from "@/app/lib/actions";
import type { AdvancedUser, CartData, MenuItem, Restaurant } from "@/app/lib/definitions";
import { MinusIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
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
} from "@heroui/react";
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
                <MinusIcon className="size-4" />
              </Button>
              <Button disableRipple isDisabled className=" text-md" isIconOnly>
                {1}
              </Button>
              <Button disableRipple isIconOnly>
                <PlusIcon className="size-4" />
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
              <ShoppingBagIcon className="size-5" />
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
