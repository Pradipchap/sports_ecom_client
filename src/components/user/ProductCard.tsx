"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { resolveImageUrl } from "@/lib/api";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add");
    }
  };

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={resolveImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
            {product.category?.name ?? "Featured"}
          </span>
          <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
            ${product.price.toFixed(0)}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{product.name}</h3>
          <p className="text-sm leading-6 text-zinc-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">In stock</p>
            <p className="font-semibold text-zinc-900">{product.stock} pairs</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/product/${product.id}`}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              View
            </Link>
            <button
              onClick={handleAdd}
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
