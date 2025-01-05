import { fetchRestaurant } from "@/app/lib/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);
  // console.log(restaurant);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">{restaurant.name}</h1>
    </div>
  );
}
