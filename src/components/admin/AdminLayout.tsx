"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const AdminLayout = ({ title, children }: Props) => {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[32px] border border-white/60 bg-zinc-950 p-5 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.65)]">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.26em] text-white/50">Control center</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Admin</h2>
          </div>
          <nav className="space-y-2 text-sm">
            <Link className="block rounded-2xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white" href="/admin">
              Dashboard
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white" href="/admin/products">
              Products
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white" href="/admin/categories">
              Categories
            </Link>
          </nav>
        </aside>
        <section className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.35)]">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Admin workspace</p>
          <h1 className="mb-6 mt-2 text-3xl font-bold tracking-tight text-zinc-950">{title}</h1>
          {children}
        </section>
      </div>
    </ProtectedRoute>
  );
};
