"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Coins, CreditCard, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { user } = useAuthStore();
  const { balance, used, limit } = useCreditsStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and credits.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card p-6 gradient-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-foreground">Current Plan</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="gradient-bg text-foreground border-0 capitalize">
                {user?.plan ?? "free"}
              </Badge>
            </div>
          </div>
          <Button render={<Link href="/pricing" />} variant="outline" className="bg-muted border-border hover:bg-accent gap-1.5">
            Upgrade
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Separator className="bg-border my-4" />

        {/* Credits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Credits Used
            </span>
            <span className="text-sm text-foreground font-mono">{used} / {limit}</span>
          </div>
          <Progress value={usagePercent} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground">
            {balance} credits remaining this month. Resets on the 1st.
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-foreground">•••• •••• •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/27</p>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Recent Usage</h2>
        <div className="space-y-3">
          {[
            { project: "Summer Sale Campaign", credits: 60, date: "Mar 15" },
            { project: "Fitness App Launch", credits: 45, date: "Mar 28" },
            { project: "Welcome Credits", credits: -500, date: "Mar 1" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">{item.project}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className={`text-sm font-mono ${item.credits < 0 ? "text-brand-teal" : "text-muted-foreground"}`}>
                {item.credits > 0 ? `-${item.credits}` : `+${Math.abs(item.credits)}`} credits
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
