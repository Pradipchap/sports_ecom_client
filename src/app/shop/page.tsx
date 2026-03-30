"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/user/ProductCard";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

type FilterState = {
  search: string;
  categoryId: string;
  size: string;
  minPrice: string;
  maxPrice: string;
};

const initialFilters: FilterState = {
  search: "",
  categoryId: "",
  size: "",
  minPrice: "",
  maxPrice: "",
};

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await apiRequest<{ categories: Category[] }>("/categories");
      setCategories(data.categories);
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.categoryId) params.set("categoryId", filters.categoryId);
        if (filters.size) params.set("size", filters.size);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        params.set("limit", "100");

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await apiRequest<{ products: Product[] }>(`/products${query}`);
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [filters]);

  const activeFilters = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Find your fit</p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Filter sports gear your way</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit space-y-4 rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Filters</p>
              <p className="text-sm text-zinc-500">{activeFilters} active</p>
            </div>
            <button
              onClick={() => setFilters(initialFilters)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Search</label>
            <input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Search sports items..."
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Category</label>
            <select
              value={filters.categoryId}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Size</label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, index) => String(index + 1)).map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      size: prev.size === size ? "" : size,
                    }))
                  }
                  className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    filters.size === size
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Min price (NPR)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Max price (NPR)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-[28px] border border-white/60 bg-white/85 px-5 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Results</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{products.length} items found</h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
              Loading filtered products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
              No items matched those filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
