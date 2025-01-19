"use client";

import { updateCartData } from "@/app/lib/actions";
import type { AdvancedUser, CartData, MenuItem, Restaurant } from "@/app/lib/definitions";
import { HandThumbUpIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  user,
} from "@heroui/react";
import { Fragment, useState } from "react";

type Props = {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  user?: AdvancedUser;
};

export default function RestaurantPageMenuContent({ restaurant, menuItems, user }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCardClickHandler = (id: string, name: string, price: number, image: string) => {
    onOpen();
    setSelectedMenuItem({ id, name, price, image });
  };

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
    <Fragment>
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
      <div className="w-full lg:w-3/4">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {menuItems.map(({ id, name, price, image }) => {
            return (
              <Card
                disableRipple
                key={id}
                isPressable
                shadow="sm"
                onPress={() => onCardClickHandler(id, name, price, image)}
              >
                <CardBody className="overflow-visible">
                  <Image
                    alt={"image"}
                    width={"100%"}
                    height={"150px"}
                    className="object-cover rounded-xl"
                    src={image}
                  />
                </CardBody>
                <CardFooter className="pt-0 flex-col items-start">
                  <b className="text-sm">{name}</b>
                  <p className="text-xs">Some description here about this item</p>
                  <Divider className="my-2.5" />
                  <div className="flex items-center justify-between w-full text-sm">
                    <p className="font-semibold">{price}kr</p>
                    <div className="flex items-center gap-1 text-default-500">
                      <HandThumbUpIcon className="size-5" />
                      <p>100%</p>
                      <p>(16)</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
