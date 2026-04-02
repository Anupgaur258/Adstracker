import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreditsState {
  balance: number;
  used: number;
  limit: number;
  deduct: (amount: number) => void;
  reset: () => void;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set) => ({
      balance: 487,
      used: 13,
      limit: 500,
      deduct: (amount: number) =>
        set((state) => ({
          balance: Math.max(0, state.balance - amount),
          used: state.used + amount,
        })),
      reset: () => set({ balance: 500, used: 0 }),
    }),
    { name: "adstacker-credits" }
  )
);
