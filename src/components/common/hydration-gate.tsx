"use client";

import { useHydration } from "@/hooks/use-hydration";

export function HydrationGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hydrated = useHydration();

  if (!hydrated) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
