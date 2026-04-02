"use client";

import { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function PlanCard({ plan, index = 0 }: { plan: PricingPlan; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "glass-card-hover p-6 relative flex flex-col",
        plan.popular && "ring-2 ring-brand-purple glow-purple"
      )}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-white border-0">
          Most Popular
        </Badge>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">
            ${plan.price}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-muted-foreground">/{plan.period === "yearly" ? "yr" : "mo"}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {plan.credits === "unlimited"
            ? "Unlimited credits"
            : `${plan.credits} credits per month`}
        </p>
      </div>

      <ul className="space-y-3 flex-1 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        render={<Link href="/signup" />}
        className={cn(
          "w-full",
          plan.popular
            ? "gradient-bg text-white border-0 hover:opacity-90"
            : "bg-muted border-border hover:bg-accent"
        )}
      >
        {plan.cta}
      </Button>
    </motion.div>
  );
}
