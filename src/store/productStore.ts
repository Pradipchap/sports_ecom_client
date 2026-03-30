"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

type ProductState = {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string;
  search: string;
  loading: boolean;
  setSelectedCategoryId: (id: string) => void;
  setSearch: (value: string) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategoryId: "",
  search: "",
  loading: false,

  setSelectedCategoryId(id) {
    set({ selectedCategoryId: id });
  },

  setSearch(value) {
    set({ search: value });
  },

  async fetchProducts() {
    set({ loading: true });
    try {
      const { selectedCategoryId, search } = get();
      const params = new URLSearchParams();
      if (selectedCategoryId) {
        params.set("categoryId", selectedCategoryId);
      }
      if (search) {
        params.set("search", search);
      }

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await apiRequest<{ products: Product[] }>(`/products${query}`);
      set({ products: data.products });
    } finally {
      set({ loading: false });
    }
  },

  async fetchCategories() {
    const data = await apiRequest<{ categories: Category[] }>("/categories");
    set({ categories: data.categories });
  },

  async fetchProductById(id) {
    const data = await apiRequest<{ product: Product }>(`/products/${id}`);
    return data.product;
  },
}));
