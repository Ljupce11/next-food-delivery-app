"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { ClockIcon, SearchIcon } from "../icons";

export const previousSearches = [
  { label: "Burger king", key: "burger-king" },
  { label: "Bastard burgers", key: "bastard-burgers" },
  { label: "Mcdonalds", key: "mcdonalds" },
  { label: "Dominos", key: "dominos" },
];

export default function Search() {
  return (
    <Autocomplete
      isClearable
      size="lg"
      radius="lg"
      variant="flat"
      fullWidth={true}
      aria-label="Search"
      placeholder="Search restaurants..."
      defaultItems={previousSearches}
      startContent={
        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }
    >
      {(previousSearch) => (
        <AutocompleteItem variant="flat" key={previousSearch.key}>
          <div className="flex gap-2 items-center">
            <ClockIcon />
            <div className="flex flex-col">
              <span className="text-small">{previousSearch.label}</span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
