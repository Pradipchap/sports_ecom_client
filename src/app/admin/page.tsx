"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

type DashboardData = {
  products: Product[];
  categories: Category[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiRequest<{ products: Product[] }>("/products?limit=100"),
          apiRequest<{ categories: Category[] }>("/categories"),
        ]);
        setData({ products: productsRes.products, categories: categoriesRes.categories });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Total Products</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{data.products.length}</p>
            </article>
            <article className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Total Categories</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{data.categories.length}</p>
            </article>
            <article className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Low Stock (&lt; 5)</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                {data.products.filter((product) => product.stock < 5).length}
              </p>
            </article>
          </div>
          <div className="rounded-[28px] bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-700 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">Overview</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Keep your catalogue fresh and your inventory sharp.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Use products to manage stock and imagery, and categories to keep discovery clean across the storefront.
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
