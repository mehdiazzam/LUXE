import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, Minus, Plus, Trash2 } from "lucide-react";
import { PageBackButton } from "@/components/site/page-back-button";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Bag — LUXE" },
      { name: "description", content: "Review the items in your bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const sub = subtotal();
  const shipping = sub > 200 || sub === 0 ? 0 : 12;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBackButton />
        <div className="mx-auto flex min-h-[56vh] max-w-2xl flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your bag</p>
          <h1 className="font-display mt-3 text-5xl">Empty</h1>
          <p className="mt-3 text-sm text-muted-foreground">Begin your collection from the shop.</p>
          <Link
            to="/shop"
            className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Explore the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageBackButton />
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your bag</p>
        <h1 className="font-display mt-3 text-5xl sm:text-6xl">{items.length} items</h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-12">
        <ul className="divide-y divide-hairline lg:col-span-8">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-6 py-6">
              <Link
                to="/product/$id"
                params={{ id: String(product.id) }}
                className="block h-32 w-28 flex-shrink-0 overflow-hidden rounded-md bg-surface"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {product.category.name}
                    </p>
                    <Link
                      to="/product/$id"
                      params={{ id: String(product.id) }}
                      className="mt-1 block font-display text-xl hover:text-gold"
                    >
                      {product.title}
                    </Link>
                  </div>
                  <p className="whitespace-nowrap font-display text-xl text-gold">
                    {formatPrice(product.price * qty)}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-hairline">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="p-2 hover:text-gold"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="p-2 hover:text-gold"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:col-span-4">
          <div className="glass sticky top-24 rounded-2xl p-8">
            <h2 className="font-display text-2xl">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="text-foreground">{formatPrice(sub)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd className="text-foreground">{shipping ? formatPrice(shipping) : "Free"}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-end justify-between border-t border-hairline pt-6">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Total
              </span>
              <span className="font-display text-3xl text-gold">{formatPrice(sub + shipping)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <LockKeyhole className="h-4 w-4" />
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Firebase sign in required at checkout · No real charges
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
