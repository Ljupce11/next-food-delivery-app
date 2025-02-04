"use client";

import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import { motion } from "motion/react";

export default function RestaurantEmptyMenu() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full lg:w-3/4 gap-2 mt-10 text-xl text-gray-400"
    >
      <ClipboardIcon strokeWidth={1} className="size-10 mx-auto" />
      <p>No menu items found</p>
    </motion.div>
  );
}
