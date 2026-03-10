"use client";

import { useState, useMemo } from "react";
import type { Restaurant } from "@/lib/google-sheets";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Search, UtensilsCrossed, X } from "lucide-react";

const ALL = "__all__";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [mealSupportFilter, setMealSupportFilter] = useState(ALL);

  const categories = useMemo(
    () => [...new Set(restaurants.map((r) => r.category).filter(Boolean))],
    [restaurants]
  );

  const mealSupportOptions = useMemo(
    () => [...new Set(restaurants.map((r) => r.mealSupport).filter(Boolean))],
    [restaurants]
  );

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch = r.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === ALL || r.category === categoryFilter;
      const matchesMealSupport =
        mealSupportFilter === ALL || r.mealSupport === mealSupportFilter;
      return matchesSearch && matchesCategory && matchesMealSupport;
    });
  }, [restaurants, search, categoryFilter, mealSupportFilter]);

  const hasActiveFilter =
    search || categoryFilter !== ALL || mealSupportFilter !== ALL;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter(ALL);
    setMealSupportFilter(ALL);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">회사 근처 식당</h1>
        <p className="text-sm text-muted-foreground">
          {hasActiveFilter
            ? `${filtered.length} / ${restaurants.length}곳`
            : `총 ${restaurants.length}곳`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="식당 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? ALL)}>
          <SelectTrigger>
            <SelectValue placeholder="음식 종류" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>전체 음식</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={mealSupportFilter} onValueChange={(v) => setMealSupportFilter(v ?? ALL)}>
          <SelectTrigger>
            <SelectValue placeholder="식대 유무" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>전체 식대</SelectItem>
            {mealSupportOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3" />
            초기화
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <UtensilsCrossed className="mb-3 size-10" />
          <p className="text-sm">
            {restaurants.length === 0
              ? "등록된 식당이 없습니다."
              : "검색 결과가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((restaurant, index) => (
            <div
              key={index}
              className="group flex flex-col justify-between rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <UtensilsCrossed className="size-4 text-muted-foreground" />
                  </div>
                  <p className="truncate font-medium">{restaurant.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
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
                  className="mt-3 flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                  자세히 보기
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
