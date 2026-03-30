"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
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
      await signup(values.name, values.email, values.password);
      toast.success("Account created");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[32px] border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">Create account</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
          Join a cleaner, more elevated shopping experience.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-zinc-600">
          Create your account to save your cart, browse new arrivals, and unlock admin access when assigned.
        </p>
      </div>
      <div className="rounded-[32px] bg-zinc-950 p-8 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)]">
        <h1 className="text-2xl font-bold tracking-tight">Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Name</label>
            <input
              {...register("name")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Email</label>
            <input
              {...register("email")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-4 py-3 font-medium text-zinc-950 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-white/70">
          Already have an account?{" "}
          <Link className="font-semibold text-white hover:underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
