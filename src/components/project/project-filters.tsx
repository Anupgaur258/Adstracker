"use client";

import { Project } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { subtitleStyles } from "@/data/subtitle-styles";

interface FilterState {
  videoId: string | null;
  hookIndex: number | null;
  ctaIndex: number | null;
  subtitleStyleId: string | null;
}

export function ProjectFilters({
  project,
  filters,
  onFilterChange,
}: {
  project: Project;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) {
  const hasActiveFilters = filters.videoId || filters.hookIndex !== null || filters.ctaIndex !== null || filters.subtitleStyleId;

  const clearFilters = () => {
    onFilterChange({ videoId: null, hookIndex: null, ctaIndex: null, subtitleStyleId: null });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <p className="text-[11px] text-muted-foreground mb-1 font-medium">Video</p>
        <Select
          value={filters.videoId ?? "all"}
          onValueChange={(v) => onFilterChange({ ...filters, videoId: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-[160px] bg-muted border-border">
            <SelectValue placeholder="All Videos" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Videos</SelectItem>
            {project.videos.map((v) => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-[11px] text-muted-foreground mb-1 font-medium">Hook</p>
        <Select
          value={filters.hookIndex !== null ? String(filters.hookIndex) : "all"}
          onValueChange={(v) => onFilterChange({ ...filters, hookIndex: v === "all" ? null : Number(v) })}
        >
          <SelectTrigger className="w-[160px] bg-muted border-border">
            <SelectValue placeholder="All Hooks" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Hooks</SelectItem>
            {project.hooks.map((h, i) => (
              <SelectItem key={i} value={String(i)}>Hook {i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-[11px] text-muted-foreground mb-1 font-medium">CTA</p>
        <Select
          value={filters.ctaIndex !== null ? String(filters.ctaIndex) : "all"}
          onValueChange={(v) => onFilterChange({ ...filters, ctaIndex: v === "all" ? null : Number(v) })}
        >
          <SelectTrigger className="w-[160px] bg-muted border-border">
            <SelectValue placeholder="All CTAs" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All CTAs</SelectItem>
            {project.ctas.map((c, i) => (
              <SelectItem key={i} value={String(i)}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-[11px] text-muted-foreground mb-1 font-medium">Subtitle Style</p>
        <Select
          value={filters.subtitleStyleId ?? "all"}
          onValueChange={(v) => onFilterChange({ ...filters, subtitleStyleId: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-[160px] bg-muted border-border">
            <SelectValue placeholder="All Styles" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Styles</SelectItem>
            {project.subtitleStyles.map((sid) => {
              const style = subtitleStyles.find((s) => s.id === sid);
              return (
                <SelectItem key={sid} value={sid}>{style?.name ?? sid}</SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground gap-1 mb-0.5"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

export type { FilterState };
