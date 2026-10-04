import { fetchMenuItems } from "@/lib/data";
import type { Restaurant } from "@/lib/definitions";
import RestaurantEmptyMenu from "./restaurant-empty-menu";
import RestaurantPageMenuContent from "./restaurant-page-menu-content";

type Props = {
  restaurant: Restaurant;
};

export default async function RestaurantPageMenu({ restaurant }: Props) {
  const menuItems = await fetchMenuItems(restaurant.id);

  if (!menuItems || menuItems.length === 0) {
    return <RestaurantEmptyMenu />;
  }

  return (
    <RestaurantPageMenuContent menuItems={menuItems} restaurant={restaurant} />
  );
}
