import { fetchMenuItems, fetchRestaurant } from "@/app/lib/data";
import RestaurantPage from "@/app/ui/(main)/restaurant-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);
  const menuItems = await fetchMenuItems(id);
  // console.log(restaurant, menuItems);

  return <RestaurantPage restaurant={restaurant} menuItems={menuItems} />;
}
