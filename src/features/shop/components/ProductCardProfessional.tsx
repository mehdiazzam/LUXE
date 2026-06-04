import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { memo } from "react";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/api";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProfessionalProps {
  product: Product;
  index?: number;
}

function ProductCardProfessionalComponent({ product, index = 0 }: ProductCardProfessionalProps) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  return (
    <Link
      to="/product/$id"
      params={{ id: String(product.id) }}
      className="group relative block"
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={product.title}
    >
      <div className="relative overflow-hidden rounded-[1.7rem] border border-hairline bg-gradient-to-b from-surface/80 to-background/50 shadow-black/20 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-luxe">
        <div className="aspect-[4/5] w-full overflow-hidden bg-surface">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full border border-hairline bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            {product.category.name}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Wishlist"
          className={cn(
            "absolute right-3 top-3 rounded-full border border-hairline bg-background/60 p-2 backdrop-blur transition hover:border-gold hover:text-gold",
            wished && "border-gold text-gold",
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="pointer-events-auto w-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                add(product);
                toast.success("Added to bag");
              }}
              className="flex w-full items-center justify-between gap-3 rounded-full bg-gradient-to-r from-foreground/95 to-gold/85 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-background shadow-lg transition hover:from-gold hover:to-gold-soft"
            >
              Add to bag
              <span className="text-xs font-semibold">{formatPrice(product.price)}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition group-hover:text-gold">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold text-gold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export const ProductCardProfessional = memo(ProductCardProfessionalComponent);

export function ProductCardProfessionalSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-[1.7rem] bg-surface" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 rounded bg-surface" />
        <div className="h-2 w-1/3 rounded bg-surface" />
      </div>
    </div>
  );
}
