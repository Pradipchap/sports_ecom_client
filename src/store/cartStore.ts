"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { Cart } from "@/types";

type CartState = {
  cart: Cart | null;
  loading: boolean;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, size: number, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, size: number, quantity: number) => Promise<void>;
  removeCartItem: (productId: string, size: number) => Promise<void>;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  clearCart() {
    set({ cart: null });
  },

  async fetchCart() {
    set({ loading: true });
    try {
      const data = await apiRequest<{ cart: Cart }>("/cart");
      set({ cart: data.cart });
    } finally {
      set({ loading: false });
    }
  },

  async addToCart(productId, size, quantity = 1) {
    const data = await apiRequest<{ cart: Cart }>("/cart/add", {
      method: "POST",
      body: { productId, size, quantity },
    });
    set({ cart: data.cart });
  },

  async updateCartItem(productId, size, quantity) {
    const data = await apiRequest<{ cart: Cart }>("/cart/update", {
      method: "PUT",
      body: { productId, size, quantity },
    });
    set({ cart: data.cart });
  },

  async removeCartItem(productId, size) {
    const data = await apiRequest<{ cart: Cart }>("/cart/remove", {
      method: "DELETE",
      body: { productId, size },
    });
    set({ cart: data.cart });
  },
}));
