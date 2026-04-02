"use client";

import { useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16) || 0,
    parseInt(h.substring(2, 4), 16) || 0,
    parseInt(h.substring(4, 6), 16) || 0,
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function parseColor(value: string): { hex: string; alpha: number } {
  if (value === "transparent") return { hex: "#000000", alpha: 0 };
  if (value.startsWith("rgba(")) {
    const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
    if (m) {
      return {
        hex: rgbToHex(+m[1], +m[2], +m[3]),
        alpha: m[4] !== undefined ? +m[4] : 1,
      };
    }
  }
  if (value.startsWith("rgb(")) {
    const m = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (m) return { hex: rgbToHex(+m[1], +m[2], +m[3]), alpha: 1 };
  }
  if (value.startsWith("#")) {
    if (value.length === 9) {
      const alpha = parseInt(value.substring(7, 9), 16) / 255;
      return { hex: value.substring(0, 7), alpha };
    }
    return { hex: value, alpha: 1 };
  }
  return { hex: "#FFFFFF", alpha: 1 };
}

function toOutput(hex: string, alpha: number): string {
  if (alpha === 0) return "transparent";
  if (alpha === 1) return hex;
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface ColorPickerAlphaProps {
  value: string;
  onChange: (value: string) => void;
  showInput?: boolean;
  showNone?: boolean;
  className?: string;
}

export function ColorPickerAlpha({
  value,
  onChange,
  showInput = false,
  showNone = true,
  className,
}: ColorPickerAlphaProps) {
  const parsed = parseColor(value);
  const [hex, setHex] = useState(parsed.hex);
  const [alpha, setAlpha] = useState(parsed.alpha);

  useEffect(() => {
    const p = parseColor(value);
    setHex(p.hex);
    setAlpha(p.alpha);
  }, [value]);

  const emit = useCallback(
    (h: string, a: number) => {
      onChange(toOutput(h, a));
    },
    [onChange]
  );

  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    emit(newHex, alpha);
  };

  const handleAlphaChange = (newAlpha: number) => {
    setAlpha(newAlpha);
    emit(hex, newAlpha);
  };

  const isTransparent = alpha === 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 shrink-0">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#808080 0% 25%, #C0C0C0 0% 50%) 0 0 / 8px 8px",
            }}
          />
          <div
            className="absolute inset-0 rounded-lg border border-white/10"
            style={{ backgroundColor: toOutput(hex, alpha) }}
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {showInput && (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 font-mono text-sm h-8"
          />
        )}
        {showNone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAlpha(0);
              onChange("transparent");
            }}
            className={cn(
              "h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 shrink-0",
              isTransparent && "border-brand-purple text-brand-purple"
            )}
          >
            None
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-10 shrink-0">
          Alpha
        </span>
        <div className="flex-1 relative">
          <div
            className="absolute inset-y-0 left-0 right-0 rounded-full"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${hex})`,
            }}
          />
          <Slider
            value={[Math.round(alpha * 100)]}
            onValueChange={(v) =>
              handleAlphaChange((Array.isArray(v) ? v[0] : v) / 100)
            }
            min={0}
            max={100}
            step={1}
            className="py-1 relative"
          />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono w-8 text-right shrink-0">
          {Math.round(alpha * 100)}%
        </span>
      </div>
    </div>
  );
}
