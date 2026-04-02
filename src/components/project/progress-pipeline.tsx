"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2, AudioLines, Subtitles, Type, MousePointerClick, Video, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PipelineStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: "pending" | "active" | "completed";
}

export function ProgressPipeline({
  completedVideos,
  totalVideos,
  status,
}: {
  completedVideos: number;
  totalVideos: number;
  status: "draft" | "pending" | "generating" | "completed" | "failed";
}) {
  const progress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  const steps: PipelineStep[] = [
    {
      id: "audio",
      label: "Audio Processing",
      icon: AudioLines,
      status: status === "draft" || status === "pending" ? "pending" : progress > 0 ? "completed" : "active",
    },
    {
      id: "subtitles",
      label: "Subtitle Generation",
      icon: Subtitles,
      status: status === "draft" || status === "pending" ? "pending" : progress > 10 ? "completed" : progress > 0 ? "active" : "pending",
    },
    {
      id: "hooks",
      label: "Hook Processing",
      icon: Type,
      status: status === "draft" || status === "pending" ? "pending" : progress > 20 ? "completed" : progress > 10 ? "active" : "pending",
    },
    {
      id: "ctas",
      label: "CTA Processing",
      icon: MousePointerClick,
      status: status === "draft" || status === "pending" ? "pending" : progress > 30 ? "completed" : progress > 20 ? "active" : "pending",
    },
    {
      id: "video",
      label: `Video ${completedVideos}/${totalVideos}`,
      icon: Video,
      status: status === "completed" ? "completed" : status === "generating" ? "active" : "pending",
    },
  ];

  const statusMessage = (() => {
    switch (status) {
      case "pending":
        return "Queued for generation";
      case "generating":
        return `Generating videos... ${completedVideos} of ${totalVideos} completed`;
      case "completed":
        return `All ${totalVideos} videos generated successfully`;
      case "failed":
        return "Generation encountered errors";
      default:
        return null;
    }
  })();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Generation Pipeline</h3>
        <span className="text-xs font-mono text-brand-purple">{Math.round(progress)}%</span>
      </div>

      <Progress value={progress} className="h-2 mb-5 bg-muted" />

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  step.status === "completed" && "gradient-bg",
                  step.status === "active" && "bg-brand-purple/20 ring-2 ring-brand-purple animate-[pulse-ring_2s_ease_infinite]",
                  step.status === "pending" && "bg-muted"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4 text-foreground" />
                ) : step.status === "active" ? (
                  <Loader2 className="h-4 w-4 text-brand-purple animate-spin" />
                ) : (
                  <step.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <span className={cn(
                "text-[10px] text-center whitespace-nowrap",
                step.status === "active" ? "text-brand-purple" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-px mt-[-18px]",
                step.status === "completed" ? "gradient-bg" : "bg-accent"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Status message */}
      {statusMessage && (
        <div className={cn(
          "mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs",
          status === "pending" && "text-amber-400",
          status === "generating" && "text-brand-cyan",
          status === "completed" && "text-brand-teal",
          status === "failed" && "text-red-400"
        )}>
          {status === "generating" && <Loader2 className="h-3 w-3 animate-spin" />}
          {status === "completed" && <Check className="h-3 w-3" />}
          {status === "failed" && <AlertTriangle className="h-3 w-3" />}
          {statusMessage}
        </div>
      )}
    </div>
  );
}
