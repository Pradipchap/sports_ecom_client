"use client";

import Link from "next/link";
import { Product } from "@/types";

type Props = {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
};

export const ProductTable = ({ products, onDelete }: Props) => {
  if (products.length === 0) {
    return <p className="text-zinc-500">No products yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-[28px] border border-zinc-200">
      <table className="w-full min-w-[700px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
            <th className="px-4 py-4">Name</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Price</th>
            <th className="px-4 py-4">Stock</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-zinc-100 text-sm last:border-b-0">
              <td className="px-4 py-4 font-medium text-zinc-900">{product.name}</td>
              <td className="px-4 py-4 text-zinc-600">{product.category?.name ?? "N/A"}</td>
              <td className="px-4 py-4 font-medium text-zinc-900">${product.price.toFixed(2)}</td>
              <td className="px-4 py-4 text-zinc-600">{product.stock}</td>
              <td className="flex gap-2 px-4 py-4">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(product.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
