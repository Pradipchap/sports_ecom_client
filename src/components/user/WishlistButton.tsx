"use client";

import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/wishlistStore";

type Props = {
  productId: string;
  compact?: boolean;
};

export const WishlistButton = ({ productId, compact = false }: Props) => {
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isSaved = items.includes(productId);

  const handleToggle = () => {
    toggleItem(productId);
    toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <button
      onClick={handleToggle}
      className={
        compact
          ? `rounded-full px-3 py-1.5 text-xs font-medium transition ${
              isSaved ? "bg-zinc-950 text-white" : "bg-white/90 text-zinc-700"
            }`
          : `rounded-full px-4 py-2 text-sm font-medium transition ${
              isSaved
                ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/15"
                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`
      }
      type="button"
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
};
