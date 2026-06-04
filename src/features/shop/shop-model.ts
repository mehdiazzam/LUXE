import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { getCategories, getProducts, type ProductFilters } from "@/lib/api";

export const shopSearchSchema = z
  .object({
    q: fallback(z.string(), ""),
    cat: fallback(z.string(), ""),
    min: fallback(z.number(), 0),
    max: fallback(z.number(), 0),
    sort: fallback(z.enum(["newest", "price_asc", "price_desc", "name"]), "newest"),
  })
  .partial();

export type ShopSearch = z.infer<typeof shopSearchSchema>;
export type ShopSearchUpdater = (updater: (previous: ShopSearch) => ShopSearch) => void;

export const productsQuery = (filters: ProductFilters) =>
  queryOptions({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
  staleTime: 5 * 60_000,
});
