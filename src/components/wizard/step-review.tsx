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
            <div className="space-y-2">
              {filledHooks.map((h, i) => {
                const origIndex = wizardState.hooks.indexOf(h);
                const tmpl = hookTemplates.find((t) => t.id === wizardState.hookTemplates[origIndex]);
                const color = wizardState.hookColors[origIndex] || "#FFFFFF";
                const font = wizardState.hookFonts[origIndex] || "Inter";
                const fontSize = wizardState.hookFontSizes[origIndex] || 28;
                const boxColor = wizardState.hookBoxColors[origIndex] || "transparent";
                const outlineColor = wizardState.hookOutlineColors[origIndex] || "transparent";
                const outlineWidth = wizardState.hookOutlineWidths[origIndex] || 0;
                return (
                  <div key={i} className="rounded-lg bg-muted/50 p-2 space-y-1">
                    <div
                      className="px-2 py-1 rounded text-sm truncate"
                      style={{
                        fontFamily: font,
                        color,
                        backgroundColor: boxColor !== "transparent" ? boxColor : undefined,
                        border: outlineWidth > 0 ? `${outlineWidth}px solid ${outlineColor}` : undefined,
                        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      }}
                    >
                      {h}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[9px] text-muted-foreground">{font} · {fontSize}px</span>
                      {tmpl && (
                        <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0 shrink-0">
                          {tmpl.name}
                        </Badge>
                      )}
                    </div>
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
            <div className="space-y-2">
              {filledCtas.map((c, i) => {
                const origIndex = wizardState.ctas.indexOf(c);
                const tmpl = ctaTemplates.find((t) => t.id === wizardState.ctaTemplates[origIndex]);
                const color = wizardState.ctaColors[origIndex] || "#FFFFFF";
                const font = wizardState.ctaFonts[origIndex] || "Inter";
                const fontSize = wizardState.ctaFontSizes[origIndex] || 20;
                const boxColor = wizardState.ctaBoxColors[origIndex] || "transparent";
                const outlineColor = wizardState.ctaOutlineColors[origIndex] || "transparent";
                const outlineWidth = wizardState.ctaOutlineWidths[origIndex] || 0;
                return (
                  <div key={i} className="rounded-lg bg-muted/50 p-2 space-y-1">
                    <div
                      className="px-2 py-1 rounded text-sm truncate inline-block"
                      style={{
                        fontFamily: font,
                        color,
                        backgroundColor: boxColor !== "transparent" ? boxColor : undefined,
                        border: outlineWidth > 0 ? `${outlineWidth}px solid ${outlineColor}` : undefined,
                        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      }}
                    >
                      {c}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[9px] text-muted-foreground">{font} · {fontSize}px</span>
                      {tmpl && (
                        <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0 shrink-0">
                          {tmpl.name}
                        </Badge>
                      )}
                    </div>
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
            <div className="space-y-2">
              {selectedStyles.map((s) => (
                <div key={s.id} className="rounded-lg bg-muted/50 p-2 space-y-1">
                  <p
                    className="text-sm truncate"
                    style={{
                      fontFamily: s.font || wizardState.styling.fontFamily,
                      color: wizardState.styling.subtitleFontColor,
                      textShadow: `0 0 ${wizardState.styling.subtitleShadowBlur}px ${wizardState.styling.subtitleShadowColor}`,
                    }}
                  >
                    {s.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {s.font && (
                      <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0">
                        {s.font}
                      </Badge>
                    )}
                  </div>
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
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[9px] text-muted-foreground mb-0.5">Font</p>
                  <p className="text-xs text-foreground font-medium" style={{ fontFamily: wizardState.styling.fontFamily }}>
                    {wizardState.styling.fontFamily}
                  </p>
                  <p className="text-[9px] text-muted-foreground">{wizardState.styling.fontSize}px</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[9px] text-muted-foreground mb-0.5">Text Color</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded border border-border" style={{ backgroundColor: wizardState.styling.textColor }} />
                    <span className="text-xs text-foreground">{wizardState.styling.textColor}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[9px] text-muted-foreground mb-0.5">Durations</p>
                  <p className="text-xs text-foreground">Hook: {wizardState.styling.hookDuration}s</p>
                  <p className="text-xs text-foreground">CTA: {wizardState.styling.ctaDuration}s</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[9px] text-muted-foreground mb-0.5">Alignment</p>
                  <p className="text-[10px] text-foreground">H: {wizardState.styling.hookXPosition}</p>
                  <p className="text-[10px] text-foreground">S: {wizardState.styling.subtitleXPosition}</p>
                  <p className="text-[10px] text-foreground">C: {wizardState.styling.ctaXPosition}</p>
                </div>
              </div>
              {wizardState.styling.shadowEnabled && (
                <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" /> Shadow enabled
                </p>
              )}
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

              {/* Video thumbnails preview with applied styling - max 4 */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {wizardState.videos.slice(0, 4).map((v, vi) => {
                  const thumb = v.thumbnailUrl || demoVideos.find((d) => d.id === v.id)?.thumbnailUrl || demoVideos[0]?.thumbnailUrl || "";
                  const hookText = filledHooks[vi % filledHooks.length] || filledHooks[0];
                  const hookIdx = hookText ? wizardState.hooks.indexOf(hookText) : 0;
                  const hookColor = wizardState.hookColors[hookIdx] || "#FFFFFF";
                  const hookFont = wizardState.hookFonts[hookIdx] || "Inter";
                  const hookBoxColor = wizardState.hookBoxColors[hookIdx] || "transparent";
                  const ctaText = filledCtas[vi % filledCtas.length] || filledCtas[0];
                  const ctaIdx = ctaText ? wizardState.ctas.indexOf(ctaText) : 0;
                  const ctaColor = wizardState.ctaColors[ctaIdx] || "#FFFFFF";
                  const ctaFont = wizardState.ctaFonts[ctaIdx] || "Inter";
                  const ctaBoxColor = wizardState.ctaBoxColors[ctaIdx] || "transparent";
                  const subStyle = selectedStyles[vi % selectedStyles.length] || selectedStyles[0];

                  const alignClass = (pos: string) =>
                    pos === "left" ? "text-left items-start" : pos === "right" ? "text-right items-end" : "text-center items-center";

                  return (
                    <div key={v.id} className="aspect-[9/16] rounded-lg overflow-hidden bg-black relative">
                      {thumb ? (
                        <img src={thumb} alt={v.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 flex items-center justify-center">
                          <Film className="h-5 w-5 text-brand-purple/30" />
                        </div>
                      )}
                      {/* Dark overlay for readability */}
                      <div className="absolute inset-0 bg-black/30" />

                      {/* Hook overlay - top area */}
                      {hookText && (
                        <div
                          className={`absolute left-0 right-0 flex flex-col px-1.5 ${alignClass(wizardState.styling.hookXPosition)}`}
                          style={{ top: `${wizardState.styling.hookYPosition}%` }}
                        >
                          <span
                            className="text-[8px] leading-tight font-semibold px-1 py-0.5 rounded max-w-full truncate"
                            style={{
                              fontFamily: hookFont,
                              color: hookColor,
                              backgroundColor: hookBoxColor !== "transparent" ? hookBoxColor : undefined,
                              textShadow: wizardState.styling.shadowEnabled ? "0 1px 3px rgba(0,0,0,0.7)" : undefined,
                            }}
                          >
                            {hookText}
                          </span>
                        </div>
                      )}

                      {/* Subtitle overlay - middle-bottom area */}
                      {subStyle && (
                        <div
                          className={`absolute left-0 right-0 flex flex-col px-1.5 ${alignClass(wizardState.styling.subtitleXPosition)}`}
                          style={{ top: `${wizardState.styling.subtitleYPosition}%` }}
                        >
                          <span
                            className="text-[7px] leading-tight px-1 py-0.5 rounded max-w-full truncate"
                            style={{
                              fontFamily: subStyle.font || wizardState.styling.fontFamily,
                              color: wizardState.styling.subtitleFontColor,
                              backgroundColor: wizardState.styling.subtitleBackgroundColor !== "transparent" ? wizardState.styling.subtitleBackgroundColor : undefined,
                              textShadow: `0 0 ${wizardState.styling.subtitleShadowBlur}px ${wizardState.styling.subtitleShadowColor}`,
                            }}
                          >
                            Sample subtitle text...
                          </span>
                        </div>
                      )}

                      {/* CTA overlay - bottom area */}
                      {ctaText && (
                        <div
                          className={`absolute left-0 right-0 flex flex-col px-1.5 ${alignClass(wizardState.styling.ctaXPosition)}`}
                          style={{ top: `${wizardState.styling.ctaYPosition}%` }}
                        >
                          <span
                            className="text-[7px] leading-tight font-semibold px-1.5 py-0.5 rounded max-w-full truncate"
                            style={{
                              fontFamily: ctaFont,
                              color: ctaColor,
                              backgroundColor: ctaBoxColor !== "transparent" ? ctaBoxColor : "rgba(0,0,0,0.4)",
                              textShadow: wizardState.styling.shadowEnabled ? "0 1px 3px rgba(0,0,0,0.7)" : undefined,
                            }}
                          >
                            {ctaText}
                          </span>
                        </div>
                      )}

                      {/* Video name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                        <p className="text-[8px] text-white/80 truncate">{v.name}</p>
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
              className="w-full gradient-bg text-foreground border-0 hover:opacity-90 gap-2 h-10"
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
