import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Suspense, startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/site/header";
import {
  ProductCardProfessional,
  ProductCardProfessionalSkeleton,
} from "@/features/shop/components/ProductCardProfessional";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  categoriesQuery,
  productsQuery,
  type ShopSearch,
  type ShopSearchUpdater,
} from "@/features/shop/shop-model";
import { cn } from "@/lib/utils";

interface ShopPageProps {
  search: ShopSearch;
  setSearch: ShopSearchUpdater;
}

interface ToolbarProps {
  search: ShopSearch;
  setSearch: ShopSearchUpdater;
}

interface FiltersProps {
  search: ShopSearch;
  setSearch: ShopSearchUpdater;
}

interface ShopStatProps {
  label: string;
  value: string;
}

interface ResultsProps {
  filters: ShopSearch;
}

type SortKey = NonNullable<ShopSearch["sort"]>;

interface SortOption {
  value: SortKey;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name", label: "Name A-Z" },
];

export function ShopPage({ search, setSearch }: ShopPageProps) {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="spotlight absolute inset-0 -z-10 opacity-80" />
        <div className="absolute left-1/2 top-28 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <header className="overflow-hidden rounded-[2rem] border border-hairline bg-surface/35 p-6 shadow-luxe backdrop-blur sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] text-balance sm:text-7xl lg:text-[5.8rem]">
                  Everyday pieces, chosen with care.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Browse dependable layers, clean basics and footwear that settles naturally into
                  your week.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <ShopStat label="Pieces" value="30" />
                <ShopStat label="Shipping" value="Worldwide" />
                <ShopStat label="Edit" value="Seasonal" />
              </div>
            </div>

            <Suspense fallback={<ToolbarSkeleton />}>
              <Toolbar search={search} setSearch={setSearch} />
            </Suspense>
          </header>

          <section className="mt-8">
            <Suspense fallback={<ProductGridSkeleton />}>
              <Results filters={search} />
            </Suspense>
          </section>
        </div>
      </main>
    </>
  );
}

function ShopStat({ label, value }: ShopStatProps) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/35 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl text-foreground">{value}</p>
    </div>
  );
}

function Toolbar({ search, setSearch }: ToolbarProps) {
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const activeSort = search.sort ?? "newest";
  const sortLabel = SORT_OPTIONS.find((option) => option.value === activeSort)?.label ?? "Newest";

  return (
    <div className="mt-8 border-t border-hairline pt-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSearch((previous) => ({ ...previous, cat: "" }))}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
              !search.cat
                ? "border-gold bg-gold text-primary-foreground"
                : "border-hairline bg-background/30 text-foreground/75 hover:border-gold hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSearch((previous) => ({ ...previous, cat: category.slug }))}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                search.cat === category.slug
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-hairline bg-background/30 text-foreground/75 hover:border-gold hover:text-foreground",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Filters search={search} setSearch={setSearch} />

          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background/35 px-4 py-3 text-sm transition hover:border-gold">
                <ArrowUpDown className="h-4 w-4 text-gold" />
                {sortLabel}
              </button>
            </PopoverTrigger>
            <PopoverContent sideOffset={10} className="w-56">
              <div className="space-y-2">
                <h4 className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Sort by
                </h4>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSearch((previous) => ({ ...previous, sort: option.value }))}
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-sm transition",
                      activeSort === option.value
                        ? "bg-gold/10 text-gold"
                        : "text-foreground/80 hover:bg-surface hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

function Filters({ search, setSearch }: FiltersProps) {
  const [q, setQ] = useState(search.q ?? "");
  const [min, setMin] = useState(search.min?.toString() ?? "");
  const [max, setMax] = useState(search.max?.toString() ?? "");
  const deferredQuery = useDeferredValue(q);

  useEffect(() => {
    if (deferredQuery === (search.q ?? "")) {
      return;
    }

    startTransition(() => {
      setSearch((previous) => ({ ...previous, q: deferredQuery }));
    });
  }, [deferredQuery, search.q, setSearch]);

  const applyPrice = () => {
    startTransition(() => {
      setSearch((previous) => ({
        ...previous,
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined,
      }));
    });
  };

  const clearAll = () => {
    setQ("");
    setMin("");
    setMax("");
    startTransition(() => {
      setSearch(() => ({ q: "", cat: "", sort: "newest" }));
    });
  };

  const hasActive = !!search.q || !!search.cat || !!search.min || !!search.max;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background/35 px-4 py-3 text-sm transition hover:border-gold">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          Refine
          {hasActive ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10} align="end" className="w-[min(22rem,calc(100vw-2rem))]">
        <div className="space-y-6 rounded-lg border border-hairline bg-surface/40 p-5">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <SlidersHorizontal className="h-3 w-3" /> Refine
              </div>
              {hasActive ? (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-soft"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              ) : null}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search essentials"
                className="w-full rounded-full border border-hairline bg-surface py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Price
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                inputMode="numeric"
                value={min}
                onChange={(event) => setMin(event.target.value)}
                placeholder="Min"
                className="w-full rounded-md border border-hairline bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none"
              />
              <input
                inputMode="numeric"
                value={max}
                onChange={(event) => setMax(event.target.value)}
                placeholder="Max"
                className="w-full rounded-md border border-hairline bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none"
              />
            </div>
            <button
              onClick={applyPrice}
              className="mt-3 w-full rounded-full border border-hairline px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
            >
              Apply price
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <ProductCardProfessionalSkeleton key={index} />
      ))}
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className="mt-8 border-t border-hairline pt-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 w-28 rounded-full bg-surface" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-24 rounded-full bg-surface" />
          <div className="h-11 w-36 rounded-full bg-surface" />
        </div>
      </div>
    </div>
  );
}

function Results({ filters }: ResultsProps) {
  const { data } = useSuspenseQuery(
    productsQuery({
      query: filters.q || undefined,
      category: filters.cat || undefined,
      priceMin: filters.min,
      priceMax: filters.max,
      limit: 48,
    }),
  );

  const activeSort = filters.sort ?? "newest";
  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        switch (activeSort) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "name":
            return a.title.localeCompare(b.title);
          default:
            return b.id - a.id;
        }
      }),
    [activeSort, data],
  );

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] border border-hairline bg-surface/30 p-8 text-center">
        <p className="font-display text-3xl">Nothing found</p>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Showing {sorted.length} pieces
          </p>
          <h2 className="mt-2 font-display text-3xl">Available now</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
        {sorted.map((product, index) => (
          <ProductCardProfessional key={product.id} product={product} index={index} />
        ))}
      </div>
    </>
  );
}
