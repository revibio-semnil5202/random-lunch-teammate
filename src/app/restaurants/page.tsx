import { fetchRestaurants } from "@/lib/google-sheets";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, UtensilsCrossed } from "lucide-react";

export default async function RestaurantsPage() {
  const restaurants = await fetchRestaurants();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">회사 근처 식당</h1>
        <p className="text-sm text-muted-foreground">
          총 {restaurants.length}곳
        </p>
      </div>

      {restaurants.length === 0 ? (
        <p className="text-muted-foreground">등록된 식당이 없습니다.</p>
      ) : (
        <div className="grid gap-3">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <UtensilsCrossed className="size-5 text-muted-foreground" />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{restaurant.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{restaurant.category}</Badge>
                    {restaurant.mealSupport && (
                      <Badge variant="outline">{restaurant.mealSupport}</Badge>
                    )}
                  </div>
                </div>
                {restaurant.link && (
                  <a
                    href={restaurant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
