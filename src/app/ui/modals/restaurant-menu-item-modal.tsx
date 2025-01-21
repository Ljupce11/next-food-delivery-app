"use client";

import { updateCartData } from "@/app/lib/actions";
import type { CartData, MenuItem, Restaurant } from "@/app/lib/definitions";
import { useUserStore } from "@/app/lib/stores/userStore";
import { addItemToCart } from "@/app/lib/utils";
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
} from "@heroui/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  restaurant: Restaurant;
  selectedMenuItem: MenuItem | null;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
};

export default function RestaurantMenuItemModal({
  isOpen,
  restaurant,
  selectedMenuItem,
  onClose,
  onOpenChange,
}: Props) {
  const userData = useUserStore((state) => state.userData);
  const [isLoading, setIsLoading] = useState(false);

  const onAddToCartHandler = async () => {
    if (!userData?.id) return;
    if (!selectedMenuItem) return;
    const updatedCartData: CartData[] = addItemToCart(userData, restaurant, selectedMenuItem);
    setIsLoading(true);
    await updateCartData(userData.id, updatedCartData, restaurant.id);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{selectedMenuItem?.name}</ModalHeader>
        <ModalBody>
          <Image
            removeWrapper
            height={200}
            width={"100%"}
            className="w-full object-cover"
            src={`/api/image-proxy?url=${encodeURIComponent(selectedMenuItem?.image || "")}`}
          />
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
            fullWidth
            disableRipple
            isLoading={isLoading}
            color="primary"
            spinnerPlacement="end"
            onPress={onAddToCartHandler}
          >
            <ShoppingBagIcon className="size-5" />
            <p className="font-semibold">Add to cart</p>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
