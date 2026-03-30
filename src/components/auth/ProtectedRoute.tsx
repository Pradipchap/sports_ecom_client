"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/types";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
};

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/");
    }
  }, [initialized, user, requiredRole, router]);

  if (!initialized || !user || (requiredRole && user.role !== requiredRole)) {
    return <p>Checking access...</p>;
  }

  return <>{children}</>;
};
