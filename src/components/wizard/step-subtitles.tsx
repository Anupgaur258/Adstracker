"use client";

import { useProjectStore } from "@/stores/project-store";
import { subtitleStyles } from "@/data/subtitle-styles";
import { demoVideos } from "@/data/demo-videos";
import { LIMITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

const animClass: Record<string, string> = {
  "word-by-word": "overlay-anim-fade",
  "line-by-line": "overlay-anim-slide-up",
  karaoke: "overlay-anim-fade",
  pop: "overlay-anim-scale",
  fade: "overlay-anim-fade",
  none: "",
};

export function StepSubtitles() {
  const { wizardState, updateWizardState } = useProjectStore();
  const selected = wizardState.selectedSubtitleStyles;
  const firstVideo = wizardState.videos[0];
  const previewThumb = firstVideo?.thumbnailUrl || demoVideos[0]?.thumbnailUrl || "";

  const toggleStyle = (styleId: string) => {
    const isSelected = selected.includes(styleId);
    if (isSelected) {
      updateWizardState({
        selectedSubtitleStyles: selected.filter((id) => id !== styleId),
      });
    } else {
      if (selected.length >= LIMITS.maxSubtitleStyles) {
        toast.error(`Maximum ${LIMITS.maxSubtitleStyles} subtitle styles allowed`);
        return;
      }
      updateWizardState({
        selectedSubtitleStyles: [...selected, styleId],
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-foreground">Choose Subtitle Styles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select exactly {LIMITS.maxSubtitleStyles} creator-inspired subtitle styles.{" "}
          <span className="text-brand-purple font-medium">
            {selected.length}/{LIMITS.maxSubtitleStyles} selected
          </span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min content-start">
        {subtitleStyles.map((style, index) => {
          const isSelected = selected.includes(style.id);
          return (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleStyle(style.id)}
              className={cn(
                "glass-card-hover text-left relative overflow-hidden",
                isSelected && "ring-2 ring-brand-purple"
              )}
            >
              {/* Preview box */}
              <div className="h-28 bg-zinc-900 flex flex-col items-center justify-center px-3 rounded-t-[12px] relative overflow-hidden">
                {previewThumb ? (
                  <img src={previewThumb} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
                )}
                <div className="absolute inset-0 bg-black/30" />

                <p
                  className={cn(
                    "text-center font-semibold relative z-10 leading-tight",
                    animClass[style.animation],
                    style.id === "abdal" && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]",
                    style.id === "hormozi" && "tracking-wide uppercase",
                    style.id === "mrbeast" && "tracking-wider uppercase",
                  )}
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: `${Math.max(14, Math.min(style.fontSize, 18))}px`,
                    color: style.color,
                    backgroundColor: style.backgroundColor !== "transparent" ? style.backgroundColor : undefined,
                    padding: style.backgroundColor !== "transparent" ? "6px 14px" : undefined,
                    borderRadius: style.backgroundColor !== "transparent" ? "4px" : undefined,
                    textShadow: style.backgroundColor === "transparent" ? "1px 1px 4px rgba(0,0,0,0.8)" : undefined,
                  }}
                >
                  {style.id === "hormozi" && (
                    <>
                      {"STOP ".split("").map((c, i) => (
                        <span key={i} style={{ color: "#FFD700" }}>{c}</span>
                      ))}
                      <span>making excuses</span>
                    </>
                  )}
                  {style.id === "tiktok-viral" && (
                    <>
                      <span style={{ color: "#22D3EE" }}>This </span>
                      <span>changed my life</span>
                    </>
                  )}
                  {style.id !== "hormozi" && style.id !== "tiktok-viral" && style.preview}
                </p>
              </div>

              <div className="p-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-foreground text-xs">{style.name}</h3>
                  <Badge variant="outline" className="bg-muted border-border text-[10px] px-1.5 py-0">
                    {style.font || style.fontFamily}
                  </Badge>
                </div>
                {style.animationLabel && (
                  <Badge variant="outline" className="bg-brand-purple/10 border-brand-purple/20 text-brand-purple text-[10px] px-1.5 py-0 mb-1.5">
                    {style.animationLabel}
                  </Badge>
                )}
                {style.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {style.description}
                  </p>
                )}
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full gradient-bg flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
