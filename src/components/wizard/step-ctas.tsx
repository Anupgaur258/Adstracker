"use client";

import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { ctaTemplates } from "@/data/cta-templates";
import { LIMITS, CTA_SUGGESTIONS, FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MousePointerClick, Check } from "lucide-react";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";

const ctaPreviewStyle: Record<string, (color: string) => React.CSSProperties> = {
  solid: () => ({ background: "#8B5CF6", borderRadius: 6, color: "#fff" }),
  outline: (c) => ({ border: `2px solid ${c}`, borderRadius: 6, background: "transparent", color: c }),
  gradient: () => ({ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)", borderRadius: 99, color: "#fff" }),
  pill: () => ({ background: "#22D3EE", borderRadius: 99, color: "#fff" }),
  minimal: (c) => ({ background: "transparent", textDecoration: "underline", color: c }),
  rounded: () => ({ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff" }),
};

export function StepCtas() {
  const { wizardState, updateWizardState } = useProjectStore();
  const ctas = wizardState.ctas;
  const templates = wizardState.ctaTemplates;
  const ctaColors = wizardState.ctaColors;
  const ctaFonts = wizardState.ctaFonts;
  const ctaFontSizes = wizardState.ctaFontSizes;
  const ctaBoxColors = wizardState.ctaBoxColors;
  const ctaOutlineColors = wizardState.ctaOutlineColors;
  const ctaOutlineWidths = wizardState.ctaOutlineWidths;
  const [activeIndex, setActiveIndex] = useState(0);

  const updateCta = (index: number, value: string) => {
    const newCtas = [...ctas];
    newCtas[index] = value;
    updateWizardState({ ctas: newCtas });
  };

  const updateCtaTemplate = (templateId: string) => {
    const newTemplates = [...templates];
    newTemplates[activeIndex] = templateId;
    updateWizardState({ ctaTemplates: newTemplates });
  };

  const updateCtaColor = (color: string) => {
    const newColors = [...ctaColors];
    newColors[activeIndex] = color;
    updateWizardState({ ctaColors: newColors });
  };

  const updateCtaFont = (font: string) => {
    const newFonts = [...ctaFonts];
    newFonts[activeIndex] = font;
    updateWizardState({ ctaFonts: newFonts });
  };

  const updateCtaFontSize = (size: number) => {
    const newSizes = [...ctaFontSizes];
    newSizes[activeIndex] = size;
    updateWizardState({ ctaFontSizes: newSizes });
  };

  const updateCtaBoxColor = (color: string) => {
    const newColors = [...ctaBoxColors];
    newColors[activeIndex] = color;
    updateWizardState({ ctaBoxColors: newColors });
  };

  const updateCtaOutlineColor = (color: string) => {
    const newColors = [...ctaOutlineColors];
    newColors[activeIndex] = color;
    updateWizardState({ ctaOutlineColors: newColors });
  };

  const updateCtaOutlineWidth = (width: number) => {
    const newWidths = [...ctaOutlineWidths];
    newWidths[activeIndex] = width;
    updateWizardState({ ctaOutlineWidths: newWidths });
  };

  const applySuggestion = (suggestion: string) => {
    const emptyIndex = ctas.findIndex((c) => !c.trim());
    if (emptyIndex !== -1) {
      updateCta(emptyIndex, suggestion);
      setActiveIndex(emptyIndex);
    }
  };

  const filledCount = ctas.filter((c) => c.trim().length > 0).length;
  const activeColor = ctaColors[activeIndex] || "#FFFFFF";
  const activeFont = ctaFonts[activeIndex] || "Inter";
  const activeFontSize = ctaFontSizes[activeIndex] || 20;
  const activeBoxColor = ctaBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = ctaOutlineColors[activeIndex] || "transparent";
  const activeOutlineWidth = ctaOutlineWidths[activeIndex] || 0;
  const activeCtaText = ctas[activeIndex]?.trim() || "CTA";

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-foreground">Add CTAs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter up to {LIMITS.maxCtas} call-to-action texts.{" "}
          <span className="text-brand-purple font-medium">{filledCount}/{LIMITS.maxCtas} written</span>
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {/* Col 1: CTA inputs */}
        <div className="overflow-y-auto pr-1 space-y-2">
          {ctas.map((cta, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-full text-left rounded-xl border p-2.5 transition-all",
                activeIndex === index
                  ? "border-brand-purple bg-brand-purple/5"
                  : "border-border bg-muted/30 hover:bg-accent"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  activeIndex === index
                    ? "bg-brand-purple text-foreground"
                    : "bg-accent text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <span className="text-[11px] text-muted-foreground flex-1">CTA {index + 1}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: ctaColors[index] || "#FFFFFF" }}
                />
                {cta.trim() && <Check className="h-3 w-3 text-brand-teal shrink-0" />}
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <MousePointerClick className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={cta}
                  onChange={(e) => updateCta(index, e.target.value)}
                  onFocus={() => setActiveIndex(index)}
                  placeholder={`Enter CTA ${index + 1}...`}
                  maxLength={LIMITS.ctaMaxChars}
                  className="h-8 pl-8 pr-12 bg-muted border-border focus:border-brand-purple text-xs rounded-lg"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                  {cta.length}/{LIMITS.ctaMaxChars}
                </span>
              </div>
            </button>
          ))}

          {/* Quick suggestions */}
          <div className="pt-1">
            <p className="text-[10px] text-muted-foreground mb-1">Quick suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {CTA_SUGGESTIONS.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="bg-muted border-border hover:bg-brand-purple/10 hover:border-brand-purple/20 cursor-pointer transition-colors text-[10px]"
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Style editor for selected CTA */}
        <div className="overflow-y-auto pr-1">
          <div className="glass-card p-3 space-y-3">
            <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              CTA {activeIndex + 1} Style
            </h3>

            {/* Font Color */}
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Font Color</span>
              <ColorPickerAlpha value={activeColor} onChange={updateCtaColor} />
            </div>

            {/* Font */}
            <Select
              value={activeFont}
              onValueChange={(v) => v && updateCtaFont(v)}
            >
              <SelectTrigger className="h-7 bg-muted border-border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font} className="text-xs">
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Box color */}
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Box Color</span>
              <ColorPickerAlpha value={activeBoxColor} onChange={updateCtaBoxColor} />
            </div>

            {/* Text outline */}
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Text Outline</span>
              <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => {
                updateCtaOutlineColor(c);
                if (c === "transparent") updateCtaOutlineWidth(0);
                else if (activeOutlineWidth === 0) updateCtaOutlineWidth(1);
              }} />
              {activeOutlineColor !== "transparent" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Width</span>
                    <span className="text-[10px] text-brand-purple font-mono">{activeOutlineWidth}px</span>
                  </div>
                  <Slider
                    value={[activeOutlineWidth]}
                    onValueChange={(v) => updateCtaOutlineWidth(Array.isArray(v) ? v[0] : v)}
                    min={1}
                    max={5}
                    step={0.5}
                    className="py-0.5"
                  />
                </>
              )}
            </div>

            {/* Font size slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Font Size</span>
                <span className="text-[11px] text-brand-purple font-mono">{activeFontSize}px</span>
              </div>
              <Slider
                value={[activeFontSize]}
                onValueChange={(v) => updateCtaFontSize(Array.isArray(v) ? v[0] : v)}
                min={12}
                max={36}
                step={1}
                className="py-0.5"
              />
            </div>
          </div>
        </div>

        {/* Col 3: Template cards */}
        <div className="overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            {ctaTemplates.map((tmpl) => {
              const isSelected = templates[activeIndex] === tmpl.id;
              const styleFn = ctaPreviewStyle[tmpl.style] || ctaPreviewStyle.solid;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => updateCtaTemplate(tmpl.id)}
                  className={cn(
                    "glass-card-hover text-left relative overflow-hidden",
                    isSelected && "ring-2 ring-brand-purple"
                  )}
                >
                  {/* Preview area */}
                  <div className="h-20 bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-end pb-3 px-2 rounded-t-[12px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />
                    <span
                      className={cn(
                        "relative z-10 font-semibold px-3 py-1 inline-block",
                        `overlay-anim-${tmpl.animation}`
                      )}
                      style={{
                        ...styleFn(activeColor),
                        fontFamily: activeFont,
                        fontSize: `${Math.min(activeFontSize * 0.5, 13)}px`,
                        ...(activeBoxColor !== "transparent" && {
                          backgroundColor: activeBoxColor,
                          borderRadius: 4,
                        }),
                        ...(activeOutlineColor !== "transparent" && activeOutlineWidth > 0 && {
                          WebkitTextStroke: `${activeOutlineWidth}px ${activeOutlineColor}`,
                        }),
                      }}
                    >
                      {activeCtaText}
                    </span>
                  </div>

                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-[11px]">{tmpl.name}</h4>
                      <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0">
                        {tmpl.style}
                      </Badge>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{tmpl.description}</p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-bg flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
