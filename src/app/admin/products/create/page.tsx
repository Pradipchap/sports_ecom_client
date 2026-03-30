"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { apiRequest } from "@/lib/api";
import { Category } from "@/types";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  availableSizes: number[];
  categoryId: string;
};

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await apiRequest<{ categories: Category[] }>("/categories");
      setCategories(response.categories);
    };

    void load();
  }, []);

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

      await apiRequest("/products", {
        method: "POST",
        body: formData,
      });
      toast.success("Product created");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  return (
    <AdminLayout title="Create Product">
      <ProductForm categories={categories} onSubmit={handleSubmit} submitLabel="Create Product" />
    </AdminLayout>
  );
}
