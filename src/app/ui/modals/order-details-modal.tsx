"use client";

import type { Order } from "@/app/lib/definitions";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Fragment } from "react";

import OrderItemsDetails from "../order-items-details";
import OrderRestaurantDetails from "../order-restaurant-details";

type Props = {
  isOpen: boolean;
  modalDetails: Order | null;
  onOpenChange: (isOpen: boolean) => void;
};

export default function OrderDetailsModal({ isOpen, modalDetails: orderDetails, onOpenChange }: Props) {
  const { total } = orderDetails || {};
  return (
    <Modal
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
      style={{ height: "500px" }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <Fragment>
            <ModalHeader className="flex flex-col gap-1">Order Details</ModalHeader>
            <ModalBody>
              <OrderRestaurantDetails orderDetails={orderDetails} />
              <Divider className="my-3" />
              <OrderItemsDetails orderDetails={orderDetails} />
            </ModalBody>
            <Fragment>
              <Divider />
              <ModalFooter>
                <div className="flex flex-col w-full gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-default-600 font-semibold">Total:</p>
                    <p className="text-default-600 font-semibold">{total}kr</p>
                  </div>
                  <Button fullWidth disableRipple variant="flat" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </Fragment>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
