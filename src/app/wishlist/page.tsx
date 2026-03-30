"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/user/ProductCard";
import { apiRequest } from "@/lib/api";
import { useWishlistStore } from "@/store/wishlistStore";
import { Product } from "@/types";

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const data = await apiRequest<{ products: Product[] }>("/products?limit=100");
        setProducts(data.products.filter((product) => wishlistIds.includes(product.id)));
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [wishlistIds]);

  const wishlistCount = useMemo(() => products.length, [products.length]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Saved for later</p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Your Wishlist</h1>
          <p className="mt-2 text-zinc-600">{wishlistCount} saved items ready for your next order.</p>
        </div>
        {wishlistIds.length > 0 && (
          <button
            onClick={clearWishlist}
            className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700"
          >
            Clear wishlist
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Loading wishlist...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Your wishlist is empty.{" "}
          <Link href="/shop" className="font-semibold text-zinc-900 hover:underline">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
