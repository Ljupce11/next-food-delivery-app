"use client";

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Fragment } from "react";
import type { Order } from "@/lib/definitions";

import OrderItemsDetails from "../order-items-details";
import OrderRestaurantDetails from "../order-restaurant-details";

type Props = {
  isOpen: boolean;
  modalDetails: Order | null;
  onOpenChange: (isOpen: boolean) => void;
};

export default function OrderDetailsModal({
  isOpen,
  modalDetails: orderDetails,
  onOpenChange,
}: Props) {
  const { total } = orderDetails || {};
  return (
    <Modal
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <Fragment>
            <ModalHeader className="flex flex-col gap-1">
              Order Details
            </ModalHeader>
            <ModalBody>
              <div className="shrink-0">
                <OrderRestaurantDetails orderDetails={orderDetails} />
              </div>
              <Divider className="my-3 shrink-0" />
              <div className="min-h-32 flex-1 overflow-y-auto">
                <OrderItemsDetails orderDetails={orderDetails} />
              </div>
            </ModalBody>

            <Divider />
            <ModalFooter>
              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-default-600 font-semibold">Total:</p>
                  <p className="text-default-600 font-semibold">{total}kr</p>
                </div>
                <Button
                  fullWidth
                  disableRipple
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
              </div>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
}
