import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  profilePhoto: string | null;
  login: (email: string, _password: string) => void;
  signup: (name: string, email: string, _password: string) => void;
  logout: () => void;
  setProfilePhoto: (photo: string | null) => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "email">>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      profilePhoto: null,
      login: (email: string) => {
        set({
          isLoggedIn: true,
          user: {
            id: "user-1",
            name: email.split("@")[0],
            email,
            plan: "pro",
            createdAt: new Date().toISOString(),
          },
        });
      },
      signup: (name: string, email: string) => {
        set({
          isLoggedIn: true,
          user: {
            id: "user-1",
            name,
            email,
            plan: "free",
            createdAt: new Date().toISOString(),
          },
        });
      },
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
      setProfilePhoto: (photo) => {
        set({ profilePhoto: photo });
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    { name: "adstacker-auth" }
  )
);
