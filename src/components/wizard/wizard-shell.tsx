"use client";

import { useProjectStore } from "@/stores/project-store";
import { useHydration } from "@/hooks/use-hydration";
import { StepIndicator } from "./step-indicator";
import { StepVideos } from "./step-videos";
import { StepHooks } from "./step-hooks";
import { StepCtas } from "./step-ctas";
import { StepSubtitles } from "./step-subtitles";
import { StepStyling } from "./step-styling";
import { StepReview } from "./step-review";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const TOTAL_STEPS = 6;

export function WizardShell() {
  const { wizardState, setWizardStep } = useProjectStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const { currentStep } = wizardState;

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0:
        return wizardState.videos.length > 0 && wizardState.projectName.trim().length > 0;
      case 1:
        return wizardState.hooks.some((h) => h.trim().length > 0) && wizardState.hookTemplates.length > 0;
      case 2:
        return wizardState.ctas.some((c) => c.trim().length > 0) && wizardState.ctaTemplates.length > 0;
      case 3:
        return wizardState.selectedSubtitleStyles.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) {
      const messages: Record<number, string> = {
        0: !wizardState.projectName.trim()
          ? "Please enter a project name"
          : "Please select at least one video",
        1: "Please write at least one hook and select a template",
        2: "Please write at least one CTA and select a template",
        3: "Please select at least one subtitle style",
      };
      toast.error(messages[currentStep] || "Please complete this step");
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setWizardStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setWizardStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepVideos />;
      case 1: return <StepHooks />;
      case 2: return <StepCtas />;
      case 3: return <StepSubtitles />;
      case 4: return <StepStyling />;
      case 5: return <StepReview />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <StepIndicator currentStep={currentStep} />

      <div className="flex-1 min-h-0 mt-4 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="shrink-0 bg-background/90 backdrop-blur-sm border-t border-border py-3 -mx-4 px-4 md:-mx-6 md:px-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="bg-muted border-border hover:bg-accent gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </span>
        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            onClick={handleNext}
            className="gradient-bg text-foreground border-0 hover:opacity-90 gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div /> // Review step has its own submit button
        )}
      </div>
    </div>
  );
}
