import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { getProduct, getProducts, formatPrice } from "@/lib/api";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductCard, ProductCardSkeleton } from "@/components/site/product-card";

const productQ = (id: number) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        return await getProduct(id);
      } catch {
        throw notFound();
      }
    },
  });

const relatedQ = (category: string) =>
  queryOptions({
    queryKey: ["products", "related", category],
    queryFn: () => getProducts({ category, limit: 8 }),
  });

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product — LUXE` },
      { name: "description", content: `Product ${params.id} on LUXE.` },
      { property: "og:title", content: `Product — LUXE` },
    ],
  }),
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(productQ(Number(params.id)));
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl">Not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        That piece doesn't exist or has been retired.
      </p>
      <Link
        to="/shop"
        className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground"
      >
        Back to shop
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductBody />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="aspect-[4/5] animate-pulse rounded-2xl bg-surface" />
      <div className="space-y-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-surface" />
        <div className="h-20 w-full animate-pulse rounded bg-surface" />
      </div>
    </div>
  );
}

function ProductBody() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQ(Number(id)));
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" search={{ cat: product.category.slug }} className="hover:text-foreground">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-surface">
            <img
              src={product.images[activeImg] ?? product.images[0]}
              alt={product.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-md border transition",
                    activeImg === i ? "border-gold" : "border-hairline",
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{product.category.name}</p>
          <h1 className="font-display mt-3 text-balance text-4xl leading-tight sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-6 font-display text-3xl text-gold">{formatPrice(product.price)}</p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-hairline px-2 py-1.5">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="rounded-full p-1.5 hover:text-gold"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="rounded-full p-1.5 hover:text-gold"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, qty);
                toast.success("Added to bag");
              }}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Add to bag — {formatPrice(product.price * qty)}
            </button>
            <button
              onClick={() => {
                toggleWish(product);
                toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Wishlist"
              className={cn(
                "rounded-full border border-hairline p-3 transition hover:border-gold",
                wished && "border-gold text-gold",
              )}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />
            </button>
          </div>

          <div className="mt-10 grid gap-3 border-t border-hairline pt-6 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="h-4 w-4 text-gold" />
              Free worldwide shipping over $200
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              Lifetime guarantee — repaired or replaced
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        <Related category={product.category.slug} excludeId={product.id} />
      </Suspense>
    </div>
  );
}

function Related({ category, excludeId }: { category: string; excludeId: number }) {
  const { data } = useSuspenseQuery(relatedQ(category));
  const items = data.filter((p) => p.id !== excludeId).slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="mt-32">
      <h2 className="font-display mb-8 text-3xl sm:text-4xl">You may also like</h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
        {items.length < 4 &&
          Array.from({ length: 4 - items.length }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </section>
  );
}
