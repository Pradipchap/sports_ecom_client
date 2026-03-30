"use client";

import { useEffect } from "react";
import { CategoryFilter } from "@/components/user/CategoryFilter";
import { ProductCard } from "@/components/user/ProductCard";
import { useProductStore } from "@/store/productStore";

export default function Home() {
  const {
    products,
    categories,
    selectedCategoryId,
    search,
    loading,
    setSelectedCategoryId,
    setSearch,
    fetchProducts,
    fetchCategories,
  } = useProductStore();

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts, selectedCategoryId, search]);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-[36px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
            New season essentials
          </span>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Premium sports gear and active essentials for every game day.
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-600">
              Discover performance-focused apparel, footwear, and equipment curated for training, competition, and recovery.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, styles, categories..."
              className="w-full rounded-full border border-zinc-200 bg-white px-5 py-3 shadow-sm outline-none transition focus:border-zinc-400 md:max-w-md"
            />
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <span className="rounded-full bg-zinc-100 px-3 py-2">{products.length} products</span>
              <span className="rounded-full bg-zinc-100 px-3 py-2">{categories.length} categories</span>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-800 to-amber-700 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-white/70">Curated selection</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/70">Performance ready</p>
              <p className="mt-1 text-2xl font-semibold">Built for training, play, and recovery</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/70">Sport-first selection</p>
              <p className="mt-1 text-2xl font-semibold">Essentials across footwear, apparel, and gear</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Shop by category</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">Featured sports collections</h2>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-500">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
