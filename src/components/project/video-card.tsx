"use client";

import { GeneratedVideo, Project } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCw, Film } from "lucide-react";
import { demoVideos } from "@/data/demo-videos";
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={cn(
        "glass-card-hover overflow-hidden group",
        video.status === "completed" && "cursor-pointer"
      )}
      onClick={() => {
        if (video.status === "completed") onPreview?.(video);
      }}
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 flex items-center justify-center relative">
        {/* Thumbnail */}
        {thumbnail ? (
          <img src={thumbnail} alt={video.label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Film className="h-8 w-8 text-brand-purple/30" />
        )}

        <Badge className={cn("absolute top-2 right-2 text-[10px] z-10", status.className)} variant="outline">
          {status.label}
        </Badge>

        {video.status === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <Play className="h-5 w-5 text-white ml-0.5" />
            </div>
          </div>
        )}

        {video.status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
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
