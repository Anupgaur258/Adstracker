"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useHydration } from "@/hooks/use-hydration";

export function MarketingNavbar() {
  const { isLoggedIn } = useAuthStore();
  const hydrated = useHydration();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {hydrated && isLoggedIn ? (
            <Button render={<Link href="/dashboard" />} className="gradient-bg text-white border-0 hover:opacity-90">
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
              <Button render={<Link href="/signup" />} className="gradient-bg text-white border-0 hover:opacity-90">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
