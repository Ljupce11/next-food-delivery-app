"use client";

import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart } from "@/lib/actions";
import type { MenuItem, Restaurant } from "@/lib/definitions";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onAddToCartHandler = async () => {
    if (!selectedMenuItem) return;
    setIsLoading(true);
    try {
      // Send the intent; the server reads the cart and the item itself
      await addToCart(selectedMenuItem.id);
      onClose();
    } catch {
      // Logged out (or the session expired): adding needs an account
      router.push(`/login?callbackUrl=/restaurant/${restaurant.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="xl"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {selectedMenuItem?.name}
        </ModalHeader>
        <ModalBody>
          <Image
            removeWrapper
            height={200}
            width={"100%"}
            className="w-full object-cover"
            src={selectedMenuItem?.image || ""}
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
