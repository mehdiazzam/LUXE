import { Link } from "@tanstack/react-router";
import { LockKeyhole, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty } = useCart();
  const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0);

  return (
    <>
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-hairline bg-background shadow-luxe transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your bag</p>
            <h3 className="font-display text-2xl">{items.length} items</h3>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-2 text-foreground/70 transition hover:bg-surface hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl">Your bag is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Start your collection.</p>
              <Link
                to="/shop"
                onClick={close}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Explore the shop
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    to="/product/$id"
                    params={{ id: String(product.id) }}
                    onClick={close}
                    className="block h-24 w-20 flex-shrink-0 overflow-hidden rounded bg-surface"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        to="/product/$id"
                        params={{ id: String(product.id) }}
                        onClick={close}
                        className="line-clamp-1 text-sm font-medium hover:text-gold"
                      >
                        {product.title}
                      </Link>
                      <p className="text-sm text-gold">{formatPrice(product.price * qty)}</p>
                    </div>
                    <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                      {product.category.name}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-hairline">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="p-1.5 hover:text-gold"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="p-1.5 hover:text-gold"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-hairline px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Subtotal
              </span>
              <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={close}
                className="rounded-full border border-hairline py-3 text-center text-sm font-medium hover:border-gold hover:text-gold"
              >
                View bag
              </Link>
              <Link
                to="/checkout"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <LockKeyhole className="h-4 w-4" />
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
