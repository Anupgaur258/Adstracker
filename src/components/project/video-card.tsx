"use client";

import { GeneratedVideo, Project } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCw, Film } from "lucide-react";
import { demoVideos } from "@/data/demo-videos";
import { subtitleStyles } from "@/data/subtitle-styles";
import { motion } from "framer-motion";

const statusConfig = {
  pending: { label: "Pending", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  processing: { label: "Processing", className: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" },
  completed: { label: "Done", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function getThumbnail(project: Project | undefined, videoSourceId: string): string {
  if (!project) return "";
  const source = project.videos.find((v) => v.id === videoSourceId);
  if (source?.thumbnail) return source.thumbnail;
  const demo = demoVideos.find((d) => d.id === videoSourceId);
  if (demo?.thumbnailUrl) return demo.thumbnailUrl;
  return demoVideos[0]?.thumbnailUrl || "";
}

export function VideoCard({
  video,
  index = 0,
  project,
  onPreview,
}: {
  video: GeneratedVideo;
  index?: number;
  project?: Project;
  onPreview?: (video: GeneratedVideo) => void;
}) {
  const status = statusConfig[video.status];
  const thumbnail = getThumbnail(project, video.videoSourceId);

  // Get applied styles for overlays
  const hookText = project ? project.hooks[video.hookIndex] ?? "" : "";
  const ctaText = project ? project.ctas[video.ctaIndex] ?? "" : "";
  const subStyle = project ? subtitleStyles.find((s) => s.id === video.subtitleStyleId) : null;

  const hookColor = project?.hookColors?.[video.hookIndex] || "#FFFFFF";
  const hookFont = project?.hookFonts?.[video.hookIndex] || project?.styling.fontFamily || "Inter";
  const hookFontSize = project?.hookFontSizes?.[video.hookIndex] || 28;
  const hookBoxColor = project?.hookBoxColors?.[video.hookIndex] || "transparent";

  const ctaColor = project?.ctaColors?.[video.ctaIndex] || "#FFFFFF";
  const ctaFont = project?.ctaFonts?.[video.ctaIndex] || project?.styling.fontFamily || "Inter";
  const ctaBoxColor = project?.ctaBoxColors?.[video.ctaIndex] || "transparent";

  const isCompleted = video.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={cn(
        "glass-card-hover overflow-hidden group",
        isCompleted && "cursor-pointer"
      )}
      onClick={() => {
        if (isCompleted) onPreview?.(video);
      }}
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 flex items-center justify-center relative">
        {/* Thumbnail */}
        {thumbnail ? (
          <img src={thumbnail} alt={video.label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Film className="h-8 w-8 text-brand-purple/30" />
        )}

        {/* Applied style overlays - always visible on completed videos */}
        {isCompleted && project && (
          <>
            {/* Hook overlay */}
            {hookText && (
              <div
                className="absolute left-0 right-0 px-2 z-10 pointer-events-none"
                style={{ top: `${project.styling.hookYPosition}%`, transform: "translateY(-50%)" }}
              >
                <p
                  className="font-bold leading-tight"
                  style={{
                    color: hookColor,
                    fontFamily: hookFont,
                    fontSize: `${Math.min(hookFontSize * 0.3, 11)}px`,
                    textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                    textAlign: project.styling.hookXPosition,
                    ...(hookBoxColor !== "transparent" && {
                      backgroundColor: hookBoxColor,
                      padding: "2px 4px",
                      borderRadius: 3,
                    }),
                  }}
                >
                  {hookText}
                </p>
              </div>
            )}

            {/* Subtitle overlay */}
            {subStyle && (
              <div
                className="absolute left-0 right-0 px-2 z-10 pointer-events-none"
                style={{ top: `${project.styling.subtitleYPosition}%`, transform: "translateY(-50%)" }}
              >
                <p
                  className="leading-tight"
                  style={{
                    color: subStyle.color,
                    fontFamily: subStyle.fontFamily,
                    fontSize: `${Math.min(subStyle.fontSize * 0.25, 9)}px`,
                    textAlign: project.styling.subtitleXPosition,
                    textShadow: subStyle.backgroundColor === "transparent" ? "1px 1px 2px rgba(0,0,0,0.9)" : "none",
                    backgroundColor: subStyle.backgroundColor !== "transparent" ? subStyle.backgroundColor : undefined,
                    padding: subStyle.backgroundColor !== "transparent" ? "1px 4px" : undefined,
                    borderRadius: 2,
                  }}
                >
                  {subStyle.preview}
                </p>
              </div>
            )}

            {/* CTA overlay */}
            {ctaText && (
              <div
                className="absolute left-0 right-0 px-2 z-10 pointer-events-none"
                style={{ top: `${project.styling.ctaYPosition}%`, transform: "translateY(-50%)" }}
              >
                <div style={{ textAlign: project.styling.ctaXPosition }}>
                  <span
                    className="inline-block px-3 py-1 rounded-full font-semibold"
                    style={{
                      color: ctaColor,
                      fontFamily: ctaFont,
                      fontSize: `${Math.min(9, 9)}px`,
                      background: ctaBoxColor !== "transparent" ? ctaBoxColor : "linear-gradient(135deg, #3B82F6, #22D3EE, #14B8A6)",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    {ctaText}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <Badge className={cn("absolute top-2 right-2 text-[10px] z-20", status.className)} variant="outline">
          {status.label}
        </Badge>

        {/* Play button overlay */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/10 group-hover:bg-black/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
              <Play className="h-5 w-5 text-white ml-0.5" />
            </div>
          </div>
        )}

        {video.status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-20">
            <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white gap-1.5">
              <RotateCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-[11px] text-muted-foreground line-clamp-2">{video.label}</p>
      </div>
    </motion.div>
  );
}
