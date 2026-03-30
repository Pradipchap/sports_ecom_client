"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useAuthInit = () => {
  const initialized = useAuthStore((state) => state.initialized);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    if (!initialized) {
      void fetchMe();
    }
  }, [initialized, fetchMe]);
};
