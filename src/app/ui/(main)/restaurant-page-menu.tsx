import { fetchMenuItems, fetchUserData } from "@/app/lib/data";
import type { AdvancedUser, Restaurant } from "@/app/lib/definitions";
import type { User } from "next-auth";
import RestaurantEmptyMenu from "./restaurant-empty-menu";
import RestaurantPageMenuContent from "./restaurant-page-menu-content";

type Props = {
  user?: User;
  restaurant: Restaurant;
};

export default async function RestaurantPageMenu({ user, restaurant }: Props) {
  const menuItems = await fetchMenuItems(restaurant.id);

  if (!menuItems || menuItems.length === 0) {
    return <RestaurantEmptyMenu />;
  }

  const advancedUserData: AdvancedUser | undefined = await fetchUserData(user?.id ? user?.id : null);
  return <RestaurantPageMenuContent user={advancedUserData} menuItems={menuItems} restaurant={restaurant} />;
}
