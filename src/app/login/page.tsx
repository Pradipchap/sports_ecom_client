"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[32px] bg-linear-to-br from-zinc-950 via-zinc-900 to-amber-700 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-white/60">Welcome back</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Step back into your curated collection.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
          Sign in to manage your cart, track your favorites, and access the admin dashboard if you have permission.
        </p>
      </div>
      <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input
              {...register("email")}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 shadow-sm outline-none transition focus:border-zinc-400"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-zinc-950 px-4 py-3 text-white shadow-lg shadow-zinc-950/15 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-600">
          No account?{" "}
          <Link className="font-semibold hover:underline" href="/signup">
            Signup
          </Link>
        </p>
      </div>
    </section>
  );
}
