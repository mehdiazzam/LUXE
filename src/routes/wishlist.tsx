import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageBackButton } from "@/components/site/page-back-button";
import { useWishlist, useCart } from "@/lib/store";
import { formatPrice } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist — LUXE" }, { name: "description", content: "Your saved items." }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove } = useWishlist();
  const add = useCart((s) => s.add);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBackButton />
        <div className="mx-auto flex min-h-[56vh] max-w-2xl flex-col items-center justify-center text-center">
          <Heart className="h-10 w-10 text-gold" />
          <h1 className="font-display mt-6 text-5xl">No favorites yet</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tap the heart on any piece to save it for later.
          </p>
          <Link
            to="/shop"
            className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Discover the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageBackButton />
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Saved</p>
        <h1 className="font-display mt-3 text-5xl sm:text-6xl">Wishlist</h1>
      </header>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.id} className="glass overflow-hidden rounded-2xl">
            <Link
              to="/product/$id"
              params={{ id: String(p.id) }}
              className="block aspect-[4/3] overflow-hidden bg-surface"
            >
              <img
                src={p.images[0]}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </Link>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {p.category.name}
              </p>
              <h3 className="mt-1 line-clamp-1 font-display text-lg">{p.title}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gold">{formatPrice(p.price)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      add(p);
                      toast.success("Added to bag");
                    }}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Move to bag
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-full border border-hairline px-3 py-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
