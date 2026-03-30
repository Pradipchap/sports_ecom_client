"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const fetchProducts = async () => {
    const response = await apiRequest<{ products: Product[] }>("/products?limit=100");
    setProducts(response.products);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiRequest<{ products: Product[] }>("/products?limit=100"),
          apiRequest<{ categories: Category[] }>("/categories"),
        ]);
        setProducts(productsResponse.products);
        setCategories(categoriesResponse.categories);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
      await fetchProducts();
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          !selectedCategoryId || product.categoryId === selectedCategoryId;

        return matchesSearch && matchesCategory;
      }),
    [products, search, selectedCategoryId]
  );

  const lowStockCount = useMemo(
    () => products.filter((product) => product.stock < 10).length,
    [products]
  );

  return (
    <AdminLayout title="Products">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Total products</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">{products.length}</p>
        </div>
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Filtered results</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">{filteredProducts.length}</p>
        </div>
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Low stock</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">{lowStockCount}</p>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-zinc-600">Manage your catalogue, pricing, stock, and product imagery.</p>
        <Link
          href="/admin/products/create"
          className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-950/15"
        >
          Create Product
        </Link>
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_240px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        />
        <select
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
          className="rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? <p>Loading products...</p> : <ProductTable products={filteredProducts} onDelete={handleDelete} />}
    </AdminLayout>
  );
}
