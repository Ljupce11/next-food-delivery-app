"use client";

import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  addToast,
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

const MAX_QUANTITY = 99;

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
  const [quantity, setQuantity] = useState(1);

  const onAddToCartHandler = async () => {
    if (!selectedMenuItem) return;
    setIsLoading(true);
    try {
      const result = await addToCart(selectedMenuItem.id, quantity);
      if (result.status === "unauthenticated") {
        router.push(`/login?callbackUrl=/restaurant/${restaurant.id}`);
        return;
      }
      onClose();
      addToast({
        title: "Added to cart",
        description: `${quantity} × ${selectedMenuItem.name}`,
        color: "primary",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      addToast({
        title: "Couldn't add to cart",
        description: "Please try again.",
        color: "danger",
      });
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
            alt={selectedMenuItem?.name ?? ""}
            src={selectedMenuItem?.image || ""}
          />
          <p>Some description about this menu item</p>
          <b>{selectedMenuItem?.price}kr</b>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <ButtonGroup variant="flat" color="primary">
            <Button
              disableRipple
              isIconOnly
              aria-label="Decrease quantity"
              isDisabled={quantity <= 1}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <MinusIcon className="size-4" />
            </Button>
            <Button
              disableRipple
              isDisabled
              className=" text-md"
              isIconOnly
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </Button>
            <Button
              disableRipple
              isIconOnly
              aria-label="Increase quantity"
              isDisabled={quantity >= MAX_QUANTITY}
              onPress={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            >
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
