import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const openCart = useCart((s) => s.open);
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-hairline bg-background/70 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-medium tracking-tight">LUXE</span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-gold sm:block" />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative rounded-full p-2.5 text-foreground/70 transition hover:bg-surface hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-primary-foreground">
                {wishCount}
              </span>
            )}
          </Link>
          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative rounded-full p-2.5 text-foreground/70 transition hover:bg-surface hover:text-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full p-2.5 text-foreground/70 transition hover:bg-surface hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-hairline bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 py-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-hairline py-4 font-display text-2xl text-foreground/90 last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
