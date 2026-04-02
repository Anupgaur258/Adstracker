"use client";

import { useProjectStore } from "@/stores/project-store";
import { useCreditsStore } from "@/stores/credits-store";
import { hookTemplates } from "@/data/hook-templates";
import { ctaTemplates } from "@/data/cta-templates";
import { subtitleStyles } from "@/data/subtitle-styles";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Video, Type, MousePointerClick, Subtitles, Palette, Sparkles, Coins, Film } from "lucide-react";
import { demoVideos } from "@/data/demo-videos";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function StepReview() {
  const { wizardState, createProject } = useProjectStore();
  const { balance, deduct } = useCreditsStore();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const projectName = wizardState.projectName;

  const videoCount = wizardState.videos.length;
  const filledHooks = wizardState.hooks.filter((h) => h.trim());
  const filledCtas = wizardState.ctas.filter((c) => c.trim());
  const hookCount = filledHooks.length;
  const ctaCount = filledCtas.length;
  const subtitleCount = wizardState.selectedSubtitleStyles.length;
  const totalVideos = videoCount * hookCount * ctaCount * subtitleCount;
  const creditCost = totalVideos;

  const selectedStyles = subtitleStyles.filter((s) => wizardState.selectedSubtitleStyles.includes(s.id));

  const handleCreate = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    if (creditCost > balance) {
      toast.error("Not enough credits");
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const id = createProject(projectName.trim());
    deduct(creditCost);
    toast.success("Project created!");
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-foreground">Review & Create</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your selections and create the project.
          {projectName && <span className="text-brand-purple font-medium"> — {projectName}</span>}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {/* Col 1: Videos + Hooks */}
        <div className="overflow-y-auto pr-1 space-y-3">
          {/* Videos */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-3.5 w-3.5 text-brand-purple" />
              <h3 className="font-semibold text-foreground text-xs">Videos ({videoCount})</h3>
            </div>
            <div className="space-y-0.5">
              {wizardState.videos.map((v) => (
                <p key={v.id} className="text-xs text-muted-foreground truncate">{v.name}</p>
              ))}
            </div>
          </div>

          {/* Hooks */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-3.5 w-3.5 text-brand-blue" />
              <h3 className="font-semibold text-foreground text-xs">Hooks ({hookCount})</h3>
            </div>
            <div className="space-y-1.5">
              {filledHooks.map((h, i) => {
                const origIndex = wizardState.hooks.indexOf(h);
                const tmpl = hookTemplates.find((t) => t.id === wizardState.hookTemplates[origIndex]);
                const color = wizardState.hookColors[origIndex] || "#FFFFFF";
                const font = wizardState.hookFonts[origIndex] || "Inter";
                const fontSize = wizardState.hookFontSizes[origIndex] || 28;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs text-muted-foreground truncate flex-1">{h}</p>
                    <span className="text-[9px] text-muted-foreground shrink-0">{font} · {fontSize}px</span>
                    {tmpl && (
                      <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0 shrink-0">
                        {tmpl.name}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: CTAs + Subtitles + Styling */}
        <div className="overflow-y-auto pr-1 space-y-3">
          {/* CTAs */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="h-3.5 w-3.5 text-brand-cyan" />
              <h3 className="font-semibold text-foreground text-xs">CTAs ({ctaCount})</h3>
            </div>
            <div className="space-y-1.5">
              {filledCtas.map((c, i) => {
                const origIndex = wizardState.ctas.indexOf(c);
                const tmpl = ctaTemplates.find((t) => t.id === wizardState.ctaTemplates[origIndex]);
                const color = wizardState.ctaColors[origIndex] || "#FFFFFF";
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <Badge variant="outline" className="bg-muted border-border text-[10px]">{c}</Badge>
                    {tmpl && (
                      <span className="text-[9px] text-muted-foreground shrink-0">{tmpl.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtitles */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Subtitles className="h-3.5 w-3.5 text-brand-teal" />
              <h3 className="font-semibold text-foreground text-xs">Subtitle Styles ({subtitleCount})</h3>
            </div>
            <div className="space-y-0.5">
              {selectedStyles.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{s.name}</p>
                  {s.font && (
                    <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0">
                      {s.font}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Styling */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-3.5 w-3.5 text-brand-cyan" />
              <h3 className="font-semibold text-foreground text-xs">Styling</h3>
            </div>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p>Font: {wizardState.styling.fontFamily} · {wizardState.styling.fontSize}px</p>
              <p>Hook: {wizardState.styling.hookDuration}s · CTA: {wizardState.styling.ctaDuration}s</p>
              <p>Align: H-{wizardState.styling.hookXPosition} · S-{wizardState.styling.subtitleXPosition} · C-{wizardState.styling.ctaXPosition}</p>
            </div>
          </div>
        </div>

        {/* Col 3: Generation Summary */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 gradient-border flex-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-purple" />
                  <h3 className="text-sm font-bold text-foreground">Generation Summary</h3>
                </div>
                <span className="text-xs font-semibold gradient-text">{totalVideos} videos</span>
              </div>

              {/* Video thumbnails preview - max 4 */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {wizardState.videos.slice(0, 4).map((v) => {
                  const thumb = v.thumbnailUrl || demoVideos.find((d) => d.id === v.id)?.thumbnailUrl || demoVideos[0]?.thumbnailUrl || "";
                  return (
                    <div key={v.id} className="aspect-[9/16] rounded-lg overflow-hidden bg-black relative">
                      {thumb ? (
                        <img src={thumb} alt={v.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 flex items-center justify-center">
                          <Film className="h-5 w-5 text-brand-purple/30" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                        <p className="text-[9px] text-white truncate">{v.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalVideos > 4 && (
                <p className="text-[10px] text-muted-foreground text-center mb-2">
                  +{totalVideos - Math.min(wizardState.videos.length, 4)} more combinations
                </p>
              )}

              <div className="flex items-center justify-between p-2.5 bg-muted rounded-lg mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5" />
                  Credit cost
                </span>
                <span className="font-semibold text-foreground text-sm">{creditCost} credits</span>
              </div>

              {creditCost > balance && (
                <p className="text-xs text-red-400 mb-3">
                  Insufficient credits. You have {balance} but need {creditCost}.
                </p>
              )}
            </div>

            <Button
              onClick={handleCreate}
              disabled={creating || creditCost > balance || !projectName.trim()}
              className="w-full gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10"
            >
              {creating ? (
                "Creating project..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Project ({totalVideos} videos)
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
