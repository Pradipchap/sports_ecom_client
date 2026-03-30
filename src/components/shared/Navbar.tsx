"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export const Navbar = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cart = useCartStore((state) => state.cart);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-bold text-white shadow-lg shadow-zinc-950/20">
            SH
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-950">SportsHub</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/shop"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Cart ({cartCount})
          </Link>
          <Link
            href="/wishlist"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Wishlist ({wishlistCount})
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-transparent px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-950 px-4 py-2 font-medium text-white shadow-lg shadow-zinc-950/15"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  Admin
                </Link>
              )}
              <span className="hidden rounded-full bg-zinc-100 px-3 py-2 text-zinc-600 md:inline-flex">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
