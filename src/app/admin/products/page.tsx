"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { apiRequest } from "@/lib/api";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const response = await apiRequest<{ products: Product[] }>("/products?limit=100");
    setProducts(response.products);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProducts();
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

  return (
    <AdminLayout title="Products">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-zinc-600">Manage your catalogue, pricing, stock, and product imagery.</p>
        <Link
          href="/admin/products/create"
          className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-950/15"
        >
          Create Product
        </Link>
      </div>
      {loading ? <p>Loading products...</p> : <ProductTable products={products} onDelete={handleDelete} />}
    </AdminLayout>
  );
}
