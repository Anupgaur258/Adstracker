"use client";

import { GeneratedVideo, Project } from "@/types";
import { VideoCard } from "./video-card";
import { Film } from "lucide-react";

export function VideoGrid({
  videos,
  project,
  onPreview,
}: {
  videos: GeneratedVideo[];
  project?: Project;
  onPreview?: (video: GeneratedVideo) => void;
}) {
  if (videos.length === 0) {
    return (
      <div className="glass-card p-12 flex flex-col items-center text-center">
        <Film className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No videos match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} project={project} onPreview={onPreview} />
      ))}
    </div>
  );
}
