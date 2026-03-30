"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest, resolveImageUrl } from "@/lib/api";
import { formatCurrencyNPR } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { Product } from "@/types";
import { ProductCard } from "@/components/user/ProductCard";
import { WishlistButton } from "@/components/user/WishlistButton";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductById(params.id);
        setProduct(data);
        setSelectedSize(data.availableSizes[0] ?? null);

        const recommended = await apiRequest<{ products: Product[] }>(
          `/products?categoryId=${data.categoryId}&excludeId=${data.id}&limit=4`
        );
        setRecommendedProducts(recommended.products);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [fetchProductById, params.id]);

  const handleAdd = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!product || !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    try {
      await addToCart(product.id, selectedSize, 1);
      toast.success(`Added size ${selectedSize} to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add");
    }
  };

  const sizeGuide = useMemo(
    () => (product?.availableSizes.length ? product.availableSizes.join(", ") : "Not available"),
    [product]
  );

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 gap-8 rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-zinc-100">
          <Image
            src={resolveImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-zinc-500 uppercase">
              {product.category?.name ?? "Curated"}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950">{product.name}</h1>
            <p className="max-w-xl text-base leading-7 text-zinc-600">{product.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Price</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{formatCurrencyNPR(product.price)}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Availability</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{product.stock}</p>
              <p className="text-sm text-zinc-500">items in stock</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900">Choose your size</p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Available: {sizeGuide}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/15"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="w-fit rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/20 transition hover:bg-zinc-800"
          >
            Add to cart
          </button>
          <WishlistButton productId={product.id} />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">You may also like</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">Recommended items</h2>
        </div>
        {recommendedProducts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
            No recommended items available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {recommendedProducts.map((recommendedProduct) => (
              <ProductCard key={recommendedProduct.id} product={recommendedProduct} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
