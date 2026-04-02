"use client";

import { useProjectStore } from "@/stores/project-store";
import { FONT_OPTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorPickerAlpha } from "@/components/common/color-picker-alpha";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Type, Palette, AlignLeft, AlignCenter, AlignRight, ArrowDownUp, Subtitles } from "lucide-react";
import { demoVideos } from "@/data/demo-videos";
import { subtitleStyles } from "@/data/subtitle-styles";
import { cn } from "@/lib/utils";

type XPos = "left" | "center" | "right";

const xPosOptions: { value: XPos; icon: typeof AlignLeft }[] = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

function XPositionGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: XPos;
  onChange: (v: XPos) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex rounded-lg overflow-hidden border border-border">
        {xPosOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "px-2.5 py-1.5 text-xs transition-colors",
                value === opt.value
                  ? "bg-brand-purple text-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepStyling() {
  const { wizardState, updateWizardState } = useProjectStore();
  const styling = wizardState.styling;

  const updateStyling = (updates: Partial<typeof styling>) => {
    updateWizardState({
      styling: { ...styling, ...updates },
    });
  };

  const hookColor = wizardState.hookColors[0] || "#FFFFFF";
  const hookFont = wizardState.hookFonts[0] || styling.fontFamily;
  const ctaColor = wizardState.ctaColors[0] || "#FFFFFF";
  const ctaFont = wizardState.ctaFonts[0] || styling.fontFamily;

  // Get thumbnail from first uploaded video or first demo video
  const firstVideo = wizardState.videos[0];
  const previewThumbnail = firstVideo?.thumbnailUrl || demoVideos[0]?.thumbnailUrl || "";
  const previewVideoUrl = firstVideo?.objectUrl || demoVideos[0]?.objectUrl || "";

  // Get the first selected subtitle style for preview
  const selectedSubStyle = subtitleStyles.find((s) => wizardState.selectedSubtitleStyles.includes(s.id));

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-foreground">Customize Styling</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fine-tune the appearance of your video overlays.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {/* Col 1: Timing + Typography + Colors */}
        <div className="overflow-y-auto pr-1 space-y-3">
          {/* Duration Controls */}
          <div className="glass-card p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-brand-purple" />
              <h3 className="font-semibold text-foreground text-xs">Timing</h3>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Hook Duration</Label>
                <span className="text-[11px] text-brand-purple font-mono">{styling.hookDuration}s</span>
              </div>
              <Slider
                value={[styling.hookDuration]}
                onValueChange={(v) => updateStyling({ hookDuration: Array.isArray(v) ? v[0] : v })}
                min={1}
                max={10}
                step={0.5}
                className="py-0.5"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">CTA Duration</Label>
                <span className="text-[11px] text-brand-purple font-mono">{styling.ctaDuration}s</span>
              </div>
              <Slider
                value={[styling.ctaDuration]}
                onValueChange={(v) => updateStyling({ ctaDuration: Array.isArray(v) ? v[0] : v })}
                min={1}
                max={10}
                step={0.5}
                className="py-0.5"
              />
            </div>
          </div>

          {/* Typography Controls */}
          <div className="glass-card p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-brand-cyan" />
              <h3 className="font-semibold text-foreground text-xs">Typography</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Font Family</Label>
              <Select
                value={styling.fontFamily}
                onValueChange={(v) => v && updateStyling({ fontFamily: v })}
              >
                <SelectTrigger className="h-7 bg-muted border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font} className="text-xs">
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Font Size</Label>
                <span className="text-[11px] text-brand-cyan font-mono">{styling.fontSize}px</span>
              </div>
              <Slider
                value={[styling.fontSize]}
                onValueChange={(v) => updateStyling({ fontSize: Array.isArray(v) ? v[0] : v })}
                min={14}
                max={48}
                step={1}
                className="py-0.5"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Words Per Line</Label>
                <span className="text-[11px] text-brand-cyan font-mono">{styling.wordsPerLine}</span>
              </div>
              <Slider
                value={[styling.wordsPerLine]}
                onValueChange={(v) => updateStyling({ wordsPerLine: Array.isArray(v) ? v[0] : v })}
                min={2}
                max={8}
                step={1}
                className="py-0.5"
              />
            </div>
          </div>

          {/* Color & Effects */}
          <div className="glass-card p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-brand-teal" />
              <h3 className="font-semibold text-foreground text-xs">Colors & Effects</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Text Color</Label>
              <ColorPickerAlpha
                value={styling.textColor}
                onChange={(v) => updateStyling({ textColor: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Text Shadow</Label>
              <Switch
                checked={styling.shadowEnabled}
                onCheckedChange={(v) => updateStyling({ shadowEnabled: v })}
              />
            </div>
          </div>
        </div>

        {/* Col 2: Subtitle Styling + Alignment + Positions */}
        <div className="overflow-y-auto pr-1 space-y-2">
          {/* Subtitle Styling */}
          <div className="glass-card p-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Subtitles className="h-3 w-3 text-brand-blue" />
              <h3 className="font-semibold text-foreground text-[11px]">Subtitle Styling</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Font Color</Label>
                <ColorPickerAlpha
                  value={styling.subtitleFontColor}
                  onChange={(v) => updateStyling({ subtitleFontColor: v })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Shadow Color</Label>
                <ColorPickerAlpha
                  value={styling.subtitleShadowColor}
                  onChange={(v) => updateStyling({ subtitleShadowColor: v })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-muted-foreground">Shadow Blur</Label>
                  <span className="text-[10px] text-brand-blue font-mono">{styling.subtitleShadowBlur}px</span>
                </div>
                <Slider
                  value={[styling.subtitleShadowBlur]}
                  onValueChange={(v) => updateStyling({ subtitleShadowBlur: Array.isArray(v) ? v[0] : v })}
                  min={0}
                  max={20}
                  step={1}
                  className="py-0.5"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Background</Label>
                <ColorPickerAlpha
                  value={styling.subtitleBackgroundColor}
                  onChange={(v) => updateStyling({ subtitleBackgroundColor: v })}
                />
              </div>
            </div>
          </div>

          {/* Alignment + Positions combined */}
          <div className="glass-card p-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <AlignCenter className="h-3 w-3 text-brand-blue" />
              <h3 className="font-semibold text-foreground text-[11px]">Alignment & Position</h3>
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">Hook</Label>
                <div className="flex rounded-md overflow-hidden border border-border">
                  {xPosOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStyling({ hookXPosition: opt.value })}
                        className={cn(
                          "flex-1 py-1 text-xs transition-colors flex justify-center",
                          styling.hookXPosition === opt.value
                            ? "bg-brand-purple text-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">Subtitle</Label>
                <div className="flex rounded-md overflow-hidden border border-border">
                  {xPosOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStyling({ subtitleXPosition: opt.value })}
                        className={cn(
                          "flex-1 py-1 text-xs transition-colors flex justify-center",
                          styling.subtitleXPosition === opt.value
                            ? "bg-brand-purple text-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground mb-1 block">CTA</Label>
                <div className="flex rounded-md overflow-hidden border border-border">
                  {xPosOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStyling({ ctaXPosition: opt.value })}
                        className={cn(
                          "flex-1 py-1 text-xs transition-colors flex justify-center",
                          styling.ctaXPosition === opt.value
                            ? "bg-brand-purple text-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Position */}
          <div className="glass-card p-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <ArrowDownUp className="h-3 w-3 text-brand-purple" />
              <h3 className="font-semibold text-foreground text-[11px]">Vertical Position</h3>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Hook</Label>
                <span className="text-[10px] text-brand-purple font-mono">{styling.hookYPosition}%</span>
              </div>
              <Slider
                value={[styling.hookYPosition]}
                onValueChange={(v) => updateStyling({ hookYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-0.5"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">Subtitle</Label>
                <span className="text-[10px] text-brand-purple font-mono">{styling.subtitleYPosition}%</span>
              </div>
              <Slider
                value={[styling.subtitleYPosition]}
                onValueChange={(v) => updateStyling({ subtitleYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-0.5"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">CTA</Label>
                <span className="text-[10px] text-brand-purple font-mono">{styling.ctaYPosition}%</span>
              </div>
              <Slider
                value={[styling.ctaYPosition]}
                onValueChange={(v) => updateStyling({ ctaYPosition: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                className="py-0.5"
              />
            </div>
          </div>
        </div>

        {/* Col 3: Live Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlignCenter className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-xs">Preview</h3>
          </div>
          <div className="glass-card aspect-[9/16] max-h-[calc(100vh-340px)] relative overflow-hidden bg-black">
            {previewThumbnail ? (
              <img src={previewThumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 absolute inset-0" />
            )}
            {previewVideoUrl && (
              <video
                src={previewVideoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            )}

            {/* Hook preview */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.hookYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div
                style={{
                  fontFamily: hookFont,
                  fontSize: `${styling.fontSize * 0.65}px`,
                  color: hookColor,
                  textShadow: styling.shadowEnabled ? "2px 2px 4px rgba(0,0,0,0.8)" : "none",
                  textAlign: styling.hookXPosition,
                }}
              >
                Sample Hook Text
              </div>
            </div>

            {/* Subtitle preview - uses selected subtitle style */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.subtitleYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div
                style={{
                  fontFamily: selectedSubStyle?.fontFamily || styling.fontFamily,
                  fontSize: `${selectedSubStyle ? Math.min(selectedSubStyle.fontSize * 0.6, 16) : styling.fontSize * 0.65 * 0.7}px`,
                  color: selectedSubStyle?.color || styling.subtitleFontColor,
                  textShadow: selectedSubStyle
                    ? (selectedSubStyle.backgroundColor === "transparent" ? "1px 1px 4px rgba(0,0,0,0.8)" : "none")
                    : `0 0 ${styling.subtitleShadowBlur}px ${styling.subtitleShadowColor}`,
                  textAlign: styling.subtitleXPosition,
                  backgroundColor: selectedSubStyle
                    ? (selectedSubStyle.backgroundColor !== "transparent" ? selectedSubStyle.backgroundColor : undefined)
                    : (styling.subtitleBackgroundColor !== "transparent" ? styling.subtitleBackgroundColor : undefined),
                  padding: (selectedSubStyle?.backgroundColor !== "transparent" || styling.subtitleBackgroundColor !== "transparent") ? "3px 8px" : undefined,
                  borderRadius: 4,
                  display: "inline-block",
                  width: "100%",
                }}
              >
                {selectedSubStyle?.preview || "Subtitle text appears here"}
              </div>
              {selectedSubStyle && (
                <p className="text-[9px] text-white/50 text-center mt-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                  {selectedSubStyle.name}
                </p>
              )}
            </div>

            {/* CTA preview */}
            <div
              className="absolute left-0 right-0 px-6 z-10"
              style={{
                top: `${styling.ctaYPosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div style={{ textAlign: styling.ctaXPosition }}>
                <span
                  className="inline-block px-6 py-2 rounded-full gradient-bg text-sm font-semibold"
                  style={{
                    fontFamily: ctaFont,
                    color: ctaColor,
                  }}
                >
                  CTA Button
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
