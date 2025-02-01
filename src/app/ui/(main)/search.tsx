"use client";

import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { searchRestaurants } from "../../lib/actions";

export const previousSearches = [
  { name: "Burger king", key: "burger-king" },
  { name: "Bastard burgers", key: "bastard-burgers" },
  { name: "Mcdonalds", key: "mcdonalds" },
  { name: "Dominos", key: "dominos" },
];

export type FieldState = {
  selectedKey: React.Key | null;
  inputValue: string;
  items: typeof previousSearches;
};

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldState, setFieldState] = useState<FieldState>({
    selectedKey: "",
    inputValue: searchParams.get("search")?.toString() || "",
    items: previousSearches,
  });

  useEffect(() => {
    if (searchParams.get("search")) {
      setFieldState((prevState) => ({
        ...prevState,
        items: previousSearches.filter((item) =>
          item.name.toLowerCase().startsWith(prevState.inputValue.toLowerCase()),
        ),
      }));
    }
  }, [searchParams]);

  const onSelectionChange = useDebouncedCallback((key: React.Key | null) => {
    const updatedFieldState = { ...fieldState };
    const selectedItem = updatedFieldState.items.find((option) => option.key === key);
    const params = new URLSearchParams(searchParams);
    if (updatedFieldState.inputValue) {
      params.set("search", updatedFieldState.inputValue);
    } else if (selectedItem) {
      params.set("search", selectedItem.name);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
    if (selectedItem) {
      setFieldState((_prevState) => {
        return {
          selectedKey: key,
          inputValue: selectedItem?.name || "",
          items: previousSearches.filter((item) =>
            item.name.toLowerCase().startsWith(selectedItem?.name.toLowerCase() || ""),
          ),
        };
      });
    }
  }, 300);

  const onInputChange = async (value: string) => {
    setFieldState((prevState) => ({
      ...prevState,
      inputValue: value,
    }));
    fetchRestaurantsOnInputChange(value);
  };

  const fetchRestaurantsOnInputChange = useDebouncedCallback(async (value: string) => {
    if (value) {
      setIsLoading(true);
      const restaurants = await searchRestaurants(value);
      setIsLoading(false);
      const autoCompleteData = restaurants.map((restaurant) => {
        return { name: restaurant.name, key: restaurant.id };
      });
      setFieldState((prevState) => ({
        ...prevState,
        items: autoCompleteData,
      }));
    } else {
      setFieldState((prevState) => ({
        ...prevState,
        items: previousSearches,
      }));
    }
  }, 300);

  return (
    <Autocomplete
      size="lg"
      radius="lg"
      variant="flat"
      isLoading={isLoading}
      fullWidth={true}
      aria-label="Search"
      placeholder="Search restaurants..."
      inputValue={fieldState.inputValue}
      items={fieldState.items}
      // @ts-ignore
      selectedKey={fieldState.selectedKey}
      onInputChange={onInputChange}
      onSelectionChange={onSelectionChange}
      startContent={
        <MagnifyingGlassIcon className="size-5 text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }
    >
      {(previousSearch) => (
        <AutocompleteItem variant="flat" key={previousSearch.key} textValue={previousSearch.name}>
          <div className="flex gap-2 items-center">
            <ClockIcon className="size-6 text-default-500" />
            <div className="flex flex-col">
              <span className="text-small">{previousSearch.name}</span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
