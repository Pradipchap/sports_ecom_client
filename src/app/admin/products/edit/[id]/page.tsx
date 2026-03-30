"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { apiRequest } from "@/lib/api";
import { Category, Product } from "@/types";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  availableSizes: number[];
  categoryId: string;
};

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!productId) {
        setLoadError("Missing product ID.");
        setLoading(false);
        return;
      }

      try {
        const [categoriesRes, productRes] = await Promise.all([
          apiRequest<{ categories: Category[] }>("/categories"),
          apiRequest<{ product: Product }>(`/products/${productId}`),
        ]);
        setCategories(categoriesRes.categories);
        setProduct(productRes.product);
        setLoadError("");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load product";
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [productId, retryKey]);

  const handleSubmit = async (values: ProductInput, imageFile: File | null) => {
    if (!productId) {
      toast.error("Missing product ID.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("availableSizes", JSON.stringify(values.availableSizes));
      formData.append("categoryId", values.categoryId);

      if (values.image) {
        formData.append("image", values.image);
      }

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await toast.promise(
        apiRequest(`/products/${productId}`, {
          method: "PUT",
          body: formData,
        }),
        {
          loading: "Updating product...",
          success: "Product updated successfully",
          error: (error) => (error instanceof Error ? error.message : "Update failed"),
        }
      );

      router.push("/admin/products");
      router.refresh();
    } catch {
      return;
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setLoadError("");
    setProduct(null);
    setRetryKey((value) => value + 1);
  };

  return (
    <AdminLayout title="Edit Product">
      {loading ? (
        <p>Loading product...</p>
      ) : loadError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-medium">Could not load this product.</p>
          <p className="mt-1 text-sm">{loadError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      ) : !product ? (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 text-zinc-700">
          <p className="font-medium">Product not found.</p>
        </div>
      ) : (
        <ProductForm
          key={product.id}
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
          defaultValues={{
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            stock: product.stock,
            availableSizes: product.availableSizes,
            categoryId: product.categoryId,
          }}
        />
      )}
    </AdminLayout>
  );
}
