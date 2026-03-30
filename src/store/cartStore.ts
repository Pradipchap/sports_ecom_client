"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { Cart } from "@/types";

type CartState = {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,

  async fetchCart() {
    set({ loading: true });
    try {
      const data = await apiRequest<{ cart: Cart }>("/cart");
      set({ cart: data.cart });
    } finally {
      set({ loading: false });
    }
  },

  async addToCart(productId, quantity = 1) {
    const data = await apiRequest<{ cart: Cart }>("/cart/add", {
      method: "POST",
      body: { productId, quantity },
    });
    set({ cart: data.cart });
  },

  async updateCartItem(productId, quantity) {
    const data = await apiRequest<{ cart: Cart }>("/cart/update", {
      method: "PUT",
      body: { productId, quantity },
    });
    set({ cart: data.cart });
  },

  async removeCartItem(productId) {
    const data = await apiRequest<{ cart: Cart }>("/cart/remove", {
      method: "DELETE",
      body: { productId },
    });
    set({ cart: data.cart });
  },
}));
