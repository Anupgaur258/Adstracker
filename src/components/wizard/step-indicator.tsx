"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  "Videos",
  "Hooks",
  "CTAs",
  "Subtitles",
  "Styling",
  "Review",
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-between min-w-[600px] px-0">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                    isCompleted && "gradient-bg text-white",
                    isCurrent && "ring-2 ring-brand-purple bg-brand-purple/20 text-brand-purple",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 mt-[-18px]">
                  <div className="h-full bg-accent relative">
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 gradient-bg"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
