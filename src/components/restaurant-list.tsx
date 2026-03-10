'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { type Restaurant, SPREADSHEET_URL } from '@/lib/google-sheets';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Plus, Search, UtensilsCrossed, CreditCard, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL = '__all__';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  useEffect(() => {
    const id = toast.info('시트에 식당을 추가하면 약 5분 뒤 반영됩니다.', {
      duration: 4000,
    });
    return () => {
      toast.dismiss(id);
    };
  }, []);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [mealSupportFilter, setMealSupportFilter] = useState(ALL);

  const categories = useMemo(
    () => [...new Set(restaurants.map((r) => r.category).filter(Boolean))],
    [restaurants],
  );

  const mealSupportOptions = useMemo(
    () => [...new Set(restaurants.map((r) => r.mealSupport).filter(Boolean))],
    [restaurants],
  );

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
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
    setSearch('');
    setCategoryFilter(ALL);
    setMealSupportFilter(ALL);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold">회사 근처 식당</h1>
          <Badge className="bg-primary/10 text-primary border-0 font-semibold">
            {hasActiveFilter
              ? `${filtered.length} / ${restaurants.length}`
              : `${restaurants.length}곳`}
          </Badge>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:opacity-90 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">식당 추가</span>
          </a>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            시트 입력 후 저장하거나 <br className="sm:hidden" />
            탭을 닫아주세요.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="식당 이름으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 bg-background/80"
            />
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v ?? ALL)}
            >
              <SelectTrigger className="!h-10 flex-1 sm:flex-none sm:min-w-[160px] bg-background/80">
                <span>
                  <span className="text-muted-foreground">음식 종류: </span>
                  {categoryFilter === ALL ? '전체' : categoryFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>전체</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={mealSupportFilter}
              onValueChange={(v) => setMealSupportFilter(v ?? ALL)}
            >
              <SelectTrigger className="!h-10 flex-1 sm:flex-none sm:min-w-[160px] bg-background/80">
                <span>
                  <span className="text-muted-foreground">식대: </span>
                  {mealSupportFilter === ALL ? '전체' : mealSupportFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>전체</SelectItem>
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
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border bg-background/80 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">초기화</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
            <span className="text-xs text-muted-foreground mr-1">필터:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                &ldquo;{search}&rdquo;
                <button
                  onClick={() => setSearch('')}
                  className="ml-0.5 rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {categoryFilter !== ALL && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {categoryFilter}
                <button
                  onClick={() => setCategoryFilter(ALL)}
                  className="ml-0.5 rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {mealSupportFilter !== ALL && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                식대 {mealSupportFilter}
                <button
                  onClick={() => setMealSupportFilter(ALL)}
                  className="ml-0.5 rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <UtensilsCrossed className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">
            {restaurants.length === 0
              ? '등록된 식당이 없습니다.'
              : '검색 결과가 없습니다.'}
          </p>
          {hasActiveFilter && (
            <p className="text-xs mt-1">필터를 변경하거나 초기화해보세요.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* 좌측 컬러 바 */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-primary" />

      {/* 상단: 식당명 + 카테고리 뱃지 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-base font-bold leading-snug text-foreground">
          {restaurant.name}
        </h3>
        {restaurant.category && (
          <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <UtensilsCrossed className="h-3 w-3" />
            {restaurant.category}
          </span>
        )}
      </div>

      {/* 하단: 메타 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {restaurant.mealSupport && (
            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                restaurant.mealSupport === '가능'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-600',
              )}
            >
              <CreditCard className="h-3 w-3" />
              식대 {restaurant.mealSupport}
            </div>
          )}
        </div>

        {restaurant.naverMapLink && (
          <a
            href={restaurant.naverMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.27 2v11.1L6.73 2H2v16h4.73V6.9L13.27 18H18V2z" />
            </svg>
            네이버 지도
          </a>
        )}
      </div>
    </div>
  );
}
