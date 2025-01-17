import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function SignUpModal({ isOpen, onOpenChange }: Props) {
  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Welcome</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center gap-2 font-semibold text-default-500">
                <CheckCircleIcon className="size-16 text-blue-400" />
                <p>Your account has been created successfully</p>
                <p>Please sign in to continue</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button as={Link} href="/login" fullWidth disableRipple color="primary" onPress={onClose}>
                Sign In
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
