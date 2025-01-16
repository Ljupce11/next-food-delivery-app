import { fetchMenuItems, fetchRestaurant, fetchUserData } from "@/app/lib/data";
import type { AdvancedUser } from "@/app/lib/definitions";
import RestaurantPage from "@/app/ui/(main)/restaurant-page";
import { auth } from "../../../../../auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authData = await auth();
  const restaurant = await fetchRestaurant(id);
  const menuItems = await fetchMenuItems(id);
  const advancedUserData: AdvancedUser | undefined = await fetchUserData(
    authData?.user?.id ? authData?.user?.id : null,
  );

  return <RestaurantPage user={advancedUserData} restaurant={restaurant} menuItems={menuItems} />;
}
