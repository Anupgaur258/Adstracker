"use client";

import { useProjectStore } from "@/stores/project-store";
import { layoutTemplates } from "@/data/layout-templates";
import { cn } from "@/lib/utils";
import { Check, Layout } from "lucide-react";
import { motion } from "framer-motion";

const aspectPreview: Record<string, string> = {
  "9:16": "aspect-[9/16] max-h-[100px]",
  "16:9": "aspect-video max-h-[80px]",
  "1:1": "aspect-square max-h-[90px]",
  "4:5": "aspect-[4/5] max-h-[100px]",
};

export function StepTemplates() {
  const { wizardState, updateWizardState } = useProjectStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Choose Layout</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the output video aspect ratio.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Layout className="h-4 w-4 text-brand-purple" />
        <h3 className="font-semibold text-foreground text-sm">Layout Templates</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {layoutTemplates.map((item) => {
          const isSelected = wizardState.selectedLayoutTemplate === item.id;
          return (
            <button
              key={item.id}
              onClick={() => updateWizardState({ selectedLayoutTemplate: item.id })}
              className={cn(
                "glass-card-hover text-left relative p-4 flex flex-col items-center gap-3",
                isSelected && "ring-2 ring-brand-purple"
              )}
            >
              {/* Aspect ratio preview box */}
              <div
                className={cn(
                  "w-full bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 border border-border rounded-md",
                  aspectPreview[item.aspectRatio] || "aspect-video"
                )}
              />
              <div className="text-center">
                <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-bg flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
