"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (values: FormValues) => Promise<void>;
};

export const CategoryForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleCategorySubmit = async (values: FormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleCategorySubmit)}
      className="flex flex-col gap-3 rounded-[28px] border border-zinc-200 bg-zinc-50 p-4 md:flex-row md:items-start"
    >
      <div className="flex-1">
        <input
          {...register("name")}
          placeholder="Category name"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
};
