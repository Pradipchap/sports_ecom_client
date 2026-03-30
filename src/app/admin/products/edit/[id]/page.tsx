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
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [categoriesRes, productRes] = await Promise.all([
          apiRequest<{ categories: Category[] }>("/categories"),
          apiRequest<{ product: Product }>(`/products/${params.id}`),
        ]);
        setCategories(categoriesRes.categories);
        setProduct(productRes.product);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params.id]);

  const handleSubmit = async (values: ProductInput, imageFile: File | null) => {
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

      await apiRequest(`/products/${params.id}`, {
        method: "PUT",
        body: formData,
      });
      toast.success("Product updated");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <AdminLayout title="Edit Product">
      {loading || !product ? (
        <p>Loading product...</p>
      ) : (
        <ProductForm
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
