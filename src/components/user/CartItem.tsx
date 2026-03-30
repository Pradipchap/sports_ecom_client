"use client";

import Image from "next/image";
import { resolveImageUrl } from "@/lib/api";
import { CartItem as CartItemType } from "@/types";

type Props = {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  return (
    <article className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)] md:flex-row md:items-center">
      <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-zinc-100 md:w-24">
        <Image
          src={resolveImageUrl(item.product.image)}
          alt={item.product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-zinc-950">{item.product.name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{item.product.category?.name ?? "Premium shoe"}</p>
        <p className="mt-2 text-sm font-semibold text-zinc-800">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1">
        <button
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm"
          onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
      </div>
      <button className="text-sm font-medium text-rose-600 hover:underline" onClick={onRemove}>
        Remove
      </button>
    </article>
  );
};
