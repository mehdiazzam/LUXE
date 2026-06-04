import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/api";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  return (
    <Link
      to="/product/$id"
      params={{ id: String(product.id) }}
      className="group relative block"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Wishlist"
          className={cn(
            "absolute right-3 top-3 rounded-full border border-hairline bg-background/60 p-2 backdrop-blur transition hover:border-gold",
            wished && "border-gold text-gold",
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              add(product);
              toast.success("Added to bag");
            }}
            className="pointer-events-auto w-full rounded-full bg-foreground py-2.5 text-xs font-medium uppercase tracking-wider text-background transition hover:bg-gold hover:text-primary-foreground"
          >
            Quick add
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {product.category.name}
          </p>
          <h3 className="mt-1 line-clamp-1 text-sm font-medium text-foreground transition group-hover:text-gold">
            {product.title}
          </h3>
        </div>
        <p className="whitespace-nowrap text-sm font-medium text-gold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-md bg-surface" />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-1/3 rounded bg-surface" />
        <div className="h-3 w-2/3 rounded bg-surface" />
      </div>
    </div>
  );
}
