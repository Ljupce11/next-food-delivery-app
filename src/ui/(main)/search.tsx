"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearchBoxProps = {
  value: string;
  isReadOnly?: boolean;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

function SearchBox({
  value,
  isReadOnly,
  onValueChange,
  onClear,
  onSubmit,
}: SearchBoxProps) {
  return (
    <search className="w-full">
      <form onSubmit={onSubmit}>
        <Input
          size="lg"
          radius="lg"
          variant="flat"
          fullWidth={true}
          isClearable={!isReadOnly}
          isReadOnly={isReadOnly}
          aria-label="Search restaurants"
          placeholder="Search restaurants..."
          enterKeyHint="search"
          autoComplete="off"
          value={value}
          onValueChange={onValueChange}
          onClear={onClear}
          startContent={
            <MagnifyingGlassIcon className="size-5 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0" />
          }
        />
      </form>
    </search>
  );
}

export function SearchFallback() {
  return <SearchBox value="" isReadOnly />;
}

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [value, setValue] = useState(() => searchParams.get("search") ?? "");

  const updateSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    const trimmed = term.trim();
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const onValueChange = (term: string) => {
    setValue(term);
    updateSearch(term);
  };

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch.flush();
  };

  return (
    <SearchBox
      value={value}
      onValueChange={onValueChange}
      onClear={updateSearch.flush}
      onSubmit={onSubmit}
    />
  );
}
