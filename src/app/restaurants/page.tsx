import { fetchRestaurants } from "@/lib/google-sheets";
import { RestaurantList } from "@/components/restaurant-list";

export default async function RestaurantsPage() {
  const restaurants = await fetchRestaurants();

  return <RestaurantList restaurants={restaurants} />;
}
