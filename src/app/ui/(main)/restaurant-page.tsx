"use client";

import type { MenuItem, Restaurant } from "@/app/lib/definitions";
import {
  Button,
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
  restaurant: Restaurant;
  menuItems: MenuItem[];
};

export default function RestaurantPage({ restaurant, menuItems }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<{ name: string; price: number } | null>(null);

  return (
    <div className="flex flex-col justify-around w-full px-8 py-5 gap-3 lg:flex-row">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{selectedMenuItem?.name}</ModalHeader>
          <ModalBody>
            <Image
              height={200}
              width={"100%"}
              className="w-full object-cover"
              src="https://nextui.org/images/fruit-7.jpeg"
            />
            <p>Some description about this menu item</p>
            <b>{selectedMenuItem?.price}kr</b>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button fullWidth color="primary" onPress={() => {}}>
              Add to cart
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <RestaurantPageSidebar restaurant={restaurant} />
      <RestaurantPageMenuContent menuItems={menuItems} onOpen={onOpen} setSelectedMenuItem={setSelectedMenuItem} />
    </div>
  );
}
