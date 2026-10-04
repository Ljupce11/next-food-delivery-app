import { useSyncExternalStore } from "react";

export const ALL_CATEGORIES = "all";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function getCategory() {
  return new URLSearchParams(window.location.search).get("category");
}

export function useSelectedCategory(categories: string[]) {
  const category = useSyncExternalStore(subscribe, getCategory, () => null);
  return category && categories.includes(category) ? category : ALL_CATEGORIES;
}

export function selectCategory(slug: string) {
  window.history.replaceState(
    null,
    "",
    slug === ALL_CATEGORIES ? window.location.pathname : `?category=${slug}`,
  );
  for (const listener of listeners) {
    listener();
  }
}
