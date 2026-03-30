"use client";

import { Category } from "@/types";

type Props = {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (id: string) => void;
};

export const CategoryFilter = ({ categories, selectedCategoryId, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          selectedCategoryId === ""
            ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/15"
            : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategoryId === category.id
              ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/15"
              : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
