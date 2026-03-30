"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { apiRequest } from "@/lib/api";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const response = await apiRequest<{ categories: Category[] }>("/categories");
    setCategories(response.categories);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCategories();
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleCreate = async (values: { name: string }) => {
    try {
      await apiRequest("/categories", {
        method: "POST",
        body: values,
      });
      toast.success("Category created");
      await fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-4">
        <CategoryForm onSubmit={handleCreate} />
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-zinc-500">No categories yet.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4 font-medium text-zinc-800"
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}
