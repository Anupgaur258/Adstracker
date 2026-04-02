"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const hydrated = useHydration();
  const getProject = useProjectStore((s) => s.getProject);
  const project = hydrated ? getProject(params.id as string) : undefined;

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  if (!project) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button render={<Link href="/dashboard" />} variant="outline" className="mt-4 bg-muted border-border">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/projects/${project.id}`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Preview: {project.name}</h1>
          <p className="text-sm text-muted-foreground">Live video preview with overlays</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="aspect-[9/16] max-h-[600px] mx-auto bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 flex flex-col items-center justify-center relative">
              {/* Hook overlay */}
              <div className="absolute top-8 left-0 right-0 text-center px-4">
                <p className="text-2xl font-bold text-foreground drop-shadow-lg" style={{ fontFamily: project.styling.fontFamily }}>
                  {project.hooks[0] || "Hook text preview"}
                </p>
              </div>

              {/* Play button */}
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Play className="h-8 w-8 text-foreground/60 ml-1" />
              </div>

              {/* Subtitle overlay */}
              <div className="absolute bottom-20 left-0 right-0 text-center px-4">
                <p className="text-lg text-foreground bg-black/50 inline-block px-3 py-1 rounded">
                  Subtitle text appears here
                </p>
              </div>

              {/* CTA overlay */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="inline-block px-6 py-2.5 rounded-full gradient-bg text-foreground font-semibold text-sm">
                  {project.ctas[0] || "CTA Button"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 p-4 border-t border-border">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" className="gradient-bg text-foreground border-0 hover:opacity-90 h-10 w-10">
                <Play className="h-5 w-5 ml-0.5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Details panel */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Current Combination</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Video</span>
                <span className="text-foreground">{project.videos[0]?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hook</span>
                <span className="text-foreground truncate ml-4">Hook 1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CTA</span>
                <span className="text-foreground">{project.ctas[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Style</span>
                <span className="text-foreground">Style 1</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Styling</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Font</span>
                <span className="text-foreground">{project.styling.fontFamily}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="text-foreground font-mono">{project.styling.fontSize}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hook Duration</span>
                <span className="text-foreground font-mono">{project.styling.hookDuration}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CTA Duration</span>
                <span className="text-foreground font-mono">{project.styling.ctaDuration}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
