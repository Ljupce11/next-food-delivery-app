import { useSearchParams } from "next/navigation";

export const ALL_CATEGORIES = "all";

export function useSelectedCategory(categories: string[]) {
  const category = useSearchParams().get("category");
  return category && categories.includes(category) ? category : ALL_CATEGORIES;
}

export function selectCategory(slug: string) {
  window.history.replaceState(
    null,
    "",
    slug === ALL_CATEGORIES ? window.location.pathname : `?category=${slug}`,
  );
}
