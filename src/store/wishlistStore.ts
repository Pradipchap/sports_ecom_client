"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[];
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "sportshub-wishlist",
    }
  )
);
