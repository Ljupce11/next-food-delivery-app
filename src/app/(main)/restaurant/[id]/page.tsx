import RestaurantPage from "@/app/ui/(main)/restaurant-page";
import { auth } from "../../../../../auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authData = await auth();

  return <RestaurantPage user={authData?.user} restaurantId={id} />;
}
