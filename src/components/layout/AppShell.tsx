"use client";

import { Toaster } from "react-hot-toast";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Navbar } from "@/components/shared/Navbar";

type Props = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: Props) => {
  useAuthInit();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">{children}</main>
      <Toaster position="top-right" />
    </>
  );
};
