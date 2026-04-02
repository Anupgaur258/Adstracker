"use client";

import { useRef, useState, useEffect } from "react";
import { GeneratedVideo, Project } from "@/types";
import { demoVideos } from "@/data/demo-videos";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Share2, X } from "lucide-react";
import { toast } from "sonner";

interface VideoPreviewDialogProps {
  video: GeneratedVideo | null;
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getPlayableUrl(project: Project, videoSourceId: string): string {
  const source = project.videos.find((v) => v.id === videoSourceId);
  if (source?.url && source.url.length > 0) return source.url;
  const demo = demoVideos.find((d) => d.id === videoSourceId);
  if (demo) return demo.objectUrl;
  return demoVideos[0]?.objectUrl || "";
}

export function VideoPreviewDialog({ video, project, open, onOpenChange }: VideoPreviewDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const videoUrl = video ? getPlayableUrl(project, video.videoSourceId) : "";

  useEffect(() => {
    if (!open) {
      setPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [open]);

  // Stop body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !video) return null;

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
    setPlaying(!playing);
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `${video.label || "video"}.mp4`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started");
    }
  };

  const handleShare = async () => {
    const text = `${project.name} - ${video.label}`;
    if (navigator.share) {
      try { await navigator.share({ title: project.name, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(360px, 90vw)" }}
      >
        {/* Video container - 9:16 ratio like YouTube Shorts */}
        <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Play/Pause tap area */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            {!playing && (
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            )}
          </button>
        </div>

        {/* Info label below video */}
        <p className="text-white/80 text-xs leading-snug mt-3 w-full text-center px-2">{video.label}</p>

        {/* Action buttons below info */}
        <div className="flex items-center gap-3 mt-3 w-full">
          <Button
            onClick={handleDownload}
            className="flex-1 gradient-bg text-white border-0 hover:opacity-90 gap-2 h-10"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-10"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Close button at bottom */}
        <Button
          onClick={() => onOpenChange(false)}
          variant="ghost"
          className="mt-3 text-white/60 hover:text-white hover:bg-white/10 gap-2"
        >
          <X className="h-4 w-4" />
          Close
        </Button>
      </div>
    </div>
  );
}
