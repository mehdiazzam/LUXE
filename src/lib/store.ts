import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./api";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      add: (product, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
              ),
              isOpen: true,
            };
          }
          return { items: [...s.items, { product, qty }], isOpen: true };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.product.id === id ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.product.price, 0),
    }),
    { name: "luxe-cart-platzi-v1" },
  ),
);

type WishlistState = {
  ids: number[];
  items: Product[];
  toggle: (p: Product) => void;
  has: (id: number) => boolean;
  remove: (id: number) => void;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],
      toggle: (p) =>
        set((s) =>
          s.ids.includes(p.id)
            ? {
                ids: s.ids.filter((i) => i !== p.id),
                items: s.items.filter((i) => i.id !== p.id),
              }
            : { ids: [...s.ids, p.id], items: [...s.items, p] },
        ),
      has: (id) => get().ids.includes(id),
      remove: (id) =>
        set((s) => ({
          ids: s.ids.filter((i) => i !== id),
          items: s.items.filter((i) => i.id !== id),
        })),
      clear: () => set({ ids: [], items: [] }),
    }),
    { name: "luxe-wishlist-platzi-v1" },
  ),
);
