"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Navbar } from "@/components/shared/Navbar";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

type Props = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: Props) => {
  useAuthInit();
  const user = useAuthStore((state) => state.user);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (user) {
      void fetchCart();
    }
  }, [fetchCart, user]);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">{children}</main>
      <Toaster position="top-right" />
    </>
  );
};
