"use client";

import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { hookTemplates } from "@/data/hook-templates";
import { LIMITS, FONT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Type, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";

const hookSuggestions = [
  "Stop scrolling — this changes everything!",
  "You won't believe what happened next...",
  "The secret nobody tells you about...",
  "Watch this before it's too late!",
  "This one trick will blow your mind",
];

const positionClass: Record<string, string> = {
  top: "justify-start pt-4",
  center: "justify-center",
  bottom: "justify-end pb-4",
};

export function StepHooks() {
  const { wizardState, updateWizardState } = useProjectStore();
  const hooks = wizardState.hooks;
  const templates = wizardState.hookTemplates;
  const hookColors = wizardState.hookColors;
  const hookFonts = wizardState.hookFonts;
  const hookFontSizes = wizardState.hookFontSizes;
  const hookBoxColors = wizardState.hookBoxColors;
  const hookOutlineColors = wizardState.hookOutlineColors;
  const hookOutlineWidths = wizardState.hookOutlineWidths;
  const [activeIndex, setActiveIndex] = useState(0);

  const updateHook = (index: number, value: string) => {
    const newHooks = [...hooks];
    newHooks[index] = value;
    updateWizardState({ hooks: newHooks });
  };

  const updateHookTemplate = (templateId: string) => {
    const newTemplates = [...templates];
    newTemplates[activeIndex] = templateId;
    updateWizardState({ hookTemplates: newTemplates });
  };

  const updateHookColor = (color: string) => {
    const newColors = [...hookColors];
    newColors[activeIndex] = color;
    updateWizardState({ hookColors: newColors });
  };

  const updateHookFont = (font: string) => {
    const newFonts = [...hookFonts];
    newFonts[activeIndex] = font;
    updateWizardState({ hookFonts: newFonts });
  };

  const updateHookFontSize = (size: number) => {
    const newSizes = [...hookFontSizes];
    newSizes[activeIndex] = size;
    updateWizardState({ hookFontSizes: newSizes });
  };

  const updateHookBoxColor = (color: string) => {
    const newColors = [...hookBoxColors];
    newColors[activeIndex] = color;
    updateWizardState({ hookBoxColors: newColors });
  };

  const updateHookOutlineColor = (color: string) => {
    const newColors = [...hookOutlineColors];
    newColors[activeIndex] = color;
    updateWizardState({ hookOutlineColors: newColors });
  };

  const updateHookOutlineWidth = (width: number) => {
    const newWidths = [...hookOutlineWidths];
    newWidths[activeIndex] = width;
    updateWizardState({ hookOutlineWidths: newWidths });
  };

  const fillSuggestions = () => {
    updateWizardState({ hooks: hookSuggestions });
  };

  const filledCount = hooks.filter((h) => h.trim().length > 0).length;
  const activeColor = hookColors[activeIndex] || "#FFFFFF";
  const activeFont = hookFonts[activeIndex] || "Inter";
  const activeFontSize = hookFontSizes[activeIndex] || 28;
  const activeBoxColor = hookBoxColors[activeIndex] || "transparent";
  const activeOutlineColor = hookOutlineColors[activeIndex] || "transparent";
  const activeOutlineWidth = hookOutlineWidths[activeIndex] || 0;
  const activeHookText = hooks[activeIndex]?.trim() || "Hook";

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Write Your Hooks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter up to {LIMITS.maxHooks} hooks.{" "}
            <span className="text-brand-purple font-medium">{filledCount}/{LIMITS.maxHooks} written</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fillSuggestions}
          className="bg-muted border-border hover:bg-accent gap-1.5 shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fill Examples
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {/* Col 1: Hook inputs */}
        <div className="overflow-y-auto pr-1 space-y-2">
          {hooks.map((hook, index) => (
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
                <span className="text-[11px] text-muted-foreground flex-1">Hook {index + 1}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: hookColors[index] || "#FFFFFF" }}
                />
                {hook.trim() && <Check className="h-3 w-3 text-brand-teal shrink-0" />}
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <Type className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={hook}
                  onChange={(e) => updateHook(index, e.target.value)}
                  onFocus={() => setActiveIndex(index)}
                  placeholder={`Enter hook ${index + 1}...`}
                  maxLength={LIMITS.hookMaxChars}
                  className="h-8 pl-8 pr-12 bg-muted border-border focus:border-brand-purple text-xs rounded-lg"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                  {hook.length}/{LIMITS.hookMaxChars}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Col 2: Style editor for selected hook */}
        <div className="overflow-y-auto pr-1">
          <div className="glass-card p-3 space-y-3">
            <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              Hook {activeIndex + 1} Style
            </h3>

            {/* Font Color */}
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Font Color</span>
              <ColorPickerAlpha value={activeColor} onChange={updateHookColor} />
            </div>

            {/* Font */}
            <Select
              value={activeFont}
              onValueChange={(v) => v && updateHookFont(v)}
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
              <ColorPickerAlpha value={activeBoxColor} onChange={updateHookBoxColor} />
            </div>

            {/* Text outline */}
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Text Outline</span>
              <ColorPickerAlpha value={activeOutlineColor} onChange={(c) => {
                updateHookOutlineColor(c);
                if (c === "transparent") updateHookOutlineWidth(0);
                else if (activeOutlineWidth === 0) updateHookOutlineWidth(1);
              }} />
              {activeOutlineColor !== "transparent" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Width</span>
                    <span className="text-[10px] text-brand-purple font-mono">{activeOutlineWidth}px</span>
                  </div>
                  <Slider
                    value={[activeOutlineWidth]}
                    onValueChange={(v) => updateHookOutlineWidth(Array.isArray(v) ? v[0] : v)}
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
                onValueChange={(v) => updateHookFontSize(Array.isArray(v) ? v[0] : v)}
                min={14}
                max={48}
                step={1}
                className="py-0.5"
              />
            </div>
          </div>
        </div>

        {/* Col 3: Template cards */}
        <div className="overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            {hookTemplates.map((tmpl) => {
              const isSelected = templates[activeIndex] === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => updateHookTemplate(tmpl.id)}
                  className={cn(
                    "glass-card-hover text-left relative overflow-hidden",
                    isSelected && "ring-2 ring-brand-purple"
                  )}
                >
                  {/* Preview area */}
                  <div
                    className={cn(
                      "h-20 bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center px-2 rounded-t-[12px] relative overflow-hidden",
                      positionClass[tmpl.position]
                    )}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />
                    <p
                      className={cn(
                        "text-center font-semibold relative z-10 leading-tight",
                        `overlay-anim-${tmpl.animation}`
                      )}
                      style={{
                        color: activeColor,
                        fontFamily: activeFont,
                        fontSize: `${Math.min(activeFontSize * 0.4, 14)}px`,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                        ...(activeBoxColor !== "transparent" && {
                          backgroundColor: activeBoxColor,
                          padding: "3px 6px",
                          borderRadius: 4,
                        }),
                        ...(activeOutlineColor !== "transparent" && activeOutlineWidth > 0 && {
                          WebkitTextStroke: `${activeOutlineWidth}px ${activeOutlineColor}`,
                        }),
                      }}
                    >
                      {activeHookText}
                    </p>
                  </div>

                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-[11px]">{tmpl.name}</h4>
                      <Badge variant="outline" className="bg-muted border-border text-[9px] px-1 py-0">
                        {tmpl.animation}
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
