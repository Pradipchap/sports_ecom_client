"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatCurrencyNPR } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { cart, fetchCart } = useCartStore();
  const [completed, setCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const { register, handleSubmit } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      city: "Kathmandu",
      address: "",
      paymentMethod: "Cash on Delivery",
    },
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    void fetchCart();
  }, [fetchCart, router, user]);

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0) ?? 0;
  const shipping = cart?.items.length ? 250 : 0;
  const total = subtotal + shipping;

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setOrderId("ORD-DEMO-001");
    setCompleted(true);
    toast.success("Order placed successfully");
  };

  if (!user) {
    return <p>Redirecting...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
        Your cart is empty.{" "}
        <Link href="/shop" className="font-semibold text-zinc-900 hover:underline">
          Continue shopping
        </Link>
      </section>
    );
  }

  if (completed) {
    return (
      <section className="mx-auto max-w-3xl rounded-[32px] border border-white/60 bg-white/90 p-8 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Order confirmed</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">Your order is on its way.</h1>
        <p className="mt-4 text-zinc-600">
          This is a demo checkout flow, so no real payment was processed.
        </p>
        <div className="mt-8 grid gap-4 rounded-[28px] bg-zinc-50 p-6 text-left md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Order ID</p>
            <p className="mt-2 text-lg font-semibold text-zinc-950">{orderId}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Amount</p>
            <p className="mt-2 text-lg font-semibold text-zinc-950">{formatCurrencyNPR(total)}</p>
          </div>
        </div>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Checkout</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Complete your order</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Full name</label>
            <input
              {...register("fullName")}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
              <input
                {...register("email")}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Phone</label>
              <input
                {...register("phone")}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">City</label>
              <input
                {...register("city")}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Payment method</label>
              <select
                {...register("paymentMethod")}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
              >
                <option>Cash on Delivery</option>
                <option>eSewa</option>
                <option>Khalti</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Address</label>
            <textarea
              {...register("address")}
              rows={4}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
          </div>
          <button className="mt-2 w-fit rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white">
            Place fake order
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Order summary</p>
        <div className="mt-5 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-semibold text-zinc-950">{item.product.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                Size {item.size} x {item.quantity}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                {formatCurrencyNPR(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-zinc-200 pt-4 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span>{formatCurrencyNPR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Shipping</span>
            <span>{formatCurrencyNPR(shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-zinc-950">
            <span>Total</span>
            <span>{formatCurrencyNPR(total)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
