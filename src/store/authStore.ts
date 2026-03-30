"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";
import { User } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  async login(email, password) {
    set({ loading: true });
    try {
      const data = await apiRequest<{ user: User }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      set({ user: data.user });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  async signup(name, email, password) {
    set({ loading: true });
    try {
      const data = await apiRequest<{ user: User }>("/auth/signup", {
        method: "POST",
        body: { name, email, password },
      });
      set({ user: data.user });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  async logout() {
    await apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    set({ user: null, initialized: true });
  },

  async fetchMe() {
    set({ loading: true });
    try {
      const data = await apiRequest<{ user: User }>("/auth/me");
      set({ user: data.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    } finally {
      set({ loading: false });
    }
  },
}));
