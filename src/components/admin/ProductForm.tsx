"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resolveImageUrl } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  image: z.string().url().or(z.literal("")),
  stock: z.number().int().nonnegative(),
  availableSizes: z.array(z.number().int().min(1).max(10)).min(1, "Select at least one size"),
  categoryId: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<FormValues>;
  categories: { id: string; name: string }[];
  onSubmit: (values: FormValues, imageFile: File | null) => Promise<void>;
  submitLabel: string;
};

export const ProductForm = ({ defaultValues, categories, onSubmit, submitLabel }: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      image: defaultValues?.image ?? "",
      stock: defaultValues?.stock ?? 0,
      availableSizes: defaultValues?.availableSizes ?? [6, 7, 8, 9],
      categoryId: defaultValues?.categoryId ?? "",
    },
  });

  const imageUrlValue = useWatch({ control, name: "image" });

  useEffect(() => {
    if (!imageFile) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUploadedPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const previewUrl =
    uploadedPreviewUrl ||
    (imageUrlValue
      ? resolveImageUrl(imageUrlValue)
      : defaultValues?.image
        ? resolveImageUrl(defaultValues.image)
        : "");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, imageFile))} className="grid grid-cols-1 gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
        <input
          {...register("name")}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
        <textarea
          {...register("description")}
          rows={5}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Price (NPR)</label>
          <input
            type="number"
            step="1"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
          />
          {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Upload product photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setUploadedPreviewUrl("");
                setImageFile(file);
              }}
              className="w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Upload a JPG, PNG, or WebP image. You can also keep using an image URL below.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Image URL fallback</label>
            <input
              {...register("image")}
              placeholder="https://example.com/product-image.jpg"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="mb-3 text-sm font-medium text-zinc-700">Image preview</p>
          {previewUrl ? (
            <div className="relative h-64 overflow-hidden rounded-2xl bg-white">
              <Image src={previewUrl} alt="Product preview" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-500">
              Upload a photo or paste an image URL
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Available sizes</label>
        <div className="grid grid-cols-5 gap-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((size) => (
            <label
              key={size}
              className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm font-medium text-zinc-700"
            >
              <input
                type="checkbox"
                value={size}
                {...register("availableSizes", { valueAsNumber: true })}
                className="h-4 w-4"
              />
              {size}
            </label>
          ))}
        </div>
        {errors.availableSizes && (
          <p className="mt-2 text-sm text-red-600">{errors.availableSizes.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
        <select
          {...register("categoryId")}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm text-zinc-600">Tip: uploaded files take priority over the URL field.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-950/15 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
      {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
    </form>
  );
};
