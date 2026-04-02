import { create } from "zustand";
import { GenerationStatus } from "@/types";

interface GenerationState {
  status: GenerationStatus;
  currentStep: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  errors: string[];
  startGeneration: (totalItems: number) => void;
  updateProgress: (step: string, completed: number) => void;
  setError: (error: string) => void;
  complete: () => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>()((set) => ({
  status: "idle",
  currentStep: "",
  progress: 0,
  totalItems: 0,
  completedItems: 0,
  errors: [],
  startGeneration: (totalItems: number) =>
    set({
      status: "generating",
      totalItems,
      completedItems: 0,
      progress: 0,
      errors: [],
      currentStep: "Initializing...",
    }),
  updateProgress: (step: string, completed: number) =>
    set((state) => ({
      currentStep: step,
      completedItems: completed,
      progress: state.totalItems > 0 ? (completed / state.totalItems) * 100 : 0,
    })),
  setError: (error: string) =>
    set((state) => ({
      errors: [...state.errors, error],
      status: "failed",
    })),
  complete: () => set({ status: "completed", progress: 100 }),
  reset: () =>
    set({
      status: "idle",
      currentStep: "",
      progress: 0,
      totalItems: 0,
      completedItems: 0,
      errors: [],
    }),
}));
