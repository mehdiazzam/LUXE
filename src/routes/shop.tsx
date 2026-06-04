import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ShopPage } from "@/features/shop/shop-page";
import {
  categoriesQuery,
  productsQuery,
  shopSearchSchema,
  type ShopSearch,
} from "@/features/shop/shop-model";

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  head: () => ({
    meta: [
      { title: "Shop — LUXE" },
      {
        name: "description",
        content: "Browse the full LUXE edit. Filter by category, price and sort by what matters.",
      },
      { property: "og:title", content: "Shop — LUXE" },
      { property: "og:description", content: "Browse the full LUXE edit." },
    ],
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    return Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(
        productsQuery({
          query: deps.q || undefined,
          category: deps.cat || undefined,
          priceMin: deps.min,
          priceMax: deps.max,
          limit: 48,
        }),
      ),
    ]);
  },
  component: ShopRoute,
});

function ShopRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ShopPage
      search={search}
      setSearch={(updater) =>
        navigate({
          search: (previous) => updater(previous as ShopSearch),
        })
      }
    />
  );
}
