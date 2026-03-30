"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { CartItem } from "@/components/user/CartItem";
import { formatCurrencyNPR } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { cart, loading, fetchCart, updateCartItem, removeCartItem } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    void fetchCart();
  }, [user, router, fetchCart]);

  if (!user) {
    return <p>Redirecting...</p>;
  }

  const handleUpdate = async (productId: string, size: number, quantity: number) => {
    try {
      await updateCartItem(productId, size, quantity);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleRemove = async (productId: string, size: number) => {
    try {
      await removeCartItem(productId, size);
      toast.success("Item removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Remove failed");
    }
  };

  const total =
    cart?.items.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0) ?? 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Cart summary</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Your Cart</h1>
      </div>
      {loading ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Loading cart...
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) => handleUpdate(item.productId, item.size, quantity)}
                onRemove={() => handleRemove(item.productId, item.size)}
              />
            ))}
          </div>
          <div className="h-fit rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Order total</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
              {formatCurrencyNPR(total)}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Taxes and shipping are not included in this demo checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-zinc-950 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-zinc-950/15"
            >
              Continue to checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
