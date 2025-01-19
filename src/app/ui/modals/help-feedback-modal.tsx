"use client";

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from "@heroui/react";
import { type FormEvent, useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function HelpFeedbackModal({ isOpen, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onSendHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Modal backdrop="blur" size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="size-6" /> Help & Feedback
        </ModalHeader>
        <ModalBody>
          <Form validationBehavior="native" onSubmit={onSendHandler}>
            <div className="flex items-center w-full gap-4">
              <Input
                fullWidth
                isRequired
                label="Name"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Your name"
              />
              <Input
                fullWidth
                isRequired
                label="Email"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Your email"
              />
            </div>
            <Textarea
              isRequired
              minRows={6}
              variant="bordered"
              label="Your message"
              labelPlacement="outside"
              placeholder="Enter your message"
            />
            <Button className="my-3" type="submit" isLoading={isLoading} disableRipple fullWidth color="primary">
              Send message
            </Button>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
