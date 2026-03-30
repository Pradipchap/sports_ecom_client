"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

type ProductState = {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string;
  selectedSize: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  loading: boolean;
  setSelectedCategoryId: (id: string) => void;
  setSelectedSize: (size: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setSearch: (value: string) => void;
  fetchProducts: (filters?: {
    search?: string;
    categoryId?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    limit?: number;
    excludeId?: string;
  }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedCategoryId: "",
  selectedSize: "",
  minPrice: "",
  maxPrice: "",
  search: "",
  loading: false,

  setSelectedCategoryId(id) {
    set({ selectedCategoryId: id });
  },

  setSelectedSize(size) {
    set({ selectedSize: size });
  },

  setMinPrice(value) {
    set({ minPrice: value });
  },

  setMaxPrice(value) {
    set({ maxPrice: value });
  },

  setSearch(value) {
    set({ search: value });
  },

  async fetchProducts(filters) {
    set({ loading: true });
    try {
      const { selectedCategoryId, selectedSize, minPrice, maxPrice, search } = get();
      const params = new URLSearchParams();
      const categoryId = filters?.categoryId ?? selectedCategoryId;
      const size = filters?.size ?? selectedSize;
      const minimum = filters?.minPrice ?? minPrice;
      const maximum = filters?.maxPrice ?? maxPrice;
      const querySearch = filters?.search ?? search;

      if (categoryId) {
        params.set("categoryId", categoryId);
      }
      if (size) {
        params.set("size", size);
      }
      if (minimum) {
        params.set("minPrice", minimum);
      }
      if (maximum) {
        params.set("maxPrice", maximum);
      }
      if (querySearch) {
        params.set("search", querySearch);
      }
      if (filters?.limit) {
        params.set("limit", String(filters.limit));
      }
      if (filters?.excludeId) {
        params.set("excludeId", filters.excludeId);
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
