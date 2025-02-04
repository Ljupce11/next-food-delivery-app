"use client";

import { BellIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Button, Select, SelectItem, Switch } from "@heroui/react";

export default function ProfileSettings() {
  return (
    <div className="px-4 py-6 sm:p-8">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BellIcon className="size-6 text-default-600" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notifications
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { id: "updates", label: "Product updates" },
              { id: "offers", label: "Special offers" },
              { id: "newsletter", label: "Newsletter" },
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <Switch defaultSelected size="sm">
                  {item.label}
                </Switch>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cog8ToothIcon className="size-6 text-default-600" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Preferences
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Select
                size="sm"
                variant="bordered"
                className="max-w-xs"
                selectedKeys={["en"]}
                label="Select a language"
              >
                <SelectItem key="en">English</SelectItem>
                <SelectItem key="es">Spanish</SelectItem>
                <SelectItem key="fr">French</SelectItem>
              </Select>
            </div>

            <div>
              <Select
                selectedKeys={["cet"]}
                variant="bordered"
                size="sm"
                className="max-w-xs"
                label="Select a time zone"
              >
                <SelectItem key="pt">Pacific Time (PT)</SelectItem>
                <SelectItem key="et">Eastern Time (ET)</SelectItem>
                <SelectItem key="cet">Central European Time (CET)</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        <Button color="primary" variant="solid">
          Save changes
        </Button>
      </div>
    </div>
  );
}
