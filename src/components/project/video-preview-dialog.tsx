"use client";

import { useRef, useState, useEffect } from "react";
import { GeneratedVideo, Project } from "@/types";
import { demoVideos } from "@/data/demo-videos";
import { subtitleStyles } from "@/data/subtitle-styles";
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !video) return null;

  // Get styling data for overlays
  const hookText = project.hooks[video.hookIndex] ?? "";
  const ctaText = project.ctas[video.ctaIndex] ?? "";
  const subStyle = subtitleStyles.find((s) => s.id === video.subtitleStyleId);

  const hookColor = project.hookColors?.[video.hookIndex] || "#FFFFFF";
  const hookFont = project.hookFonts?.[video.hookIndex] || project.styling.fontFamily;
  const hookFontSize = project.hookFontSizes?.[video.hookIndex] || project.styling.fontSize;
  const hookBoxColor = project.hookBoxColors?.[video.hookIndex] || "transparent";
  const hookOutlineColor = project.hookOutlineColors?.[video.hookIndex] || "transparent";
  const hookOutlineWidth = project.hookOutlineWidths?.[video.hookIndex] || 0;

  const ctaColor = project.ctaColors?.[video.ctaIndex] || "#FFFFFF";
  const ctaFont = project.ctaFonts?.[video.ctaIndex] || project.styling.fontFamily;
  const ctaBoxColor = project.ctaBoxColors?.[video.ctaIndex] || "transparent";

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
        {/* Video container - 9:16 ratio */}
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

          {/* Hook overlay */}
          {hookText && (
            <div
              className="absolute left-0 right-0 px-4 z-10 pointer-events-none"
              style={{ top: `${project.styling.hookYPosition}%`, transform: "translateY(-50%)" }}
            >
              <p
                className="font-bold leading-tight"
                style={{
                  color: hookColor,
                  fontFamily: hookFont,
                  fontSize: `${hookFontSize * 0.55}px`,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  textAlign: project.styling.hookXPosition,
                  ...(hookBoxColor !== "transparent" && {
                    backgroundColor: hookBoxColor,
                    padding: "4px 10px",
                    borderRadius: 4,
                    display: "inline-block",
                    width: "100%",
                  }),
                  ...(hookOutlineColor !== "transparent" && hookOutlineWidth > 0 && {
                    WebkitTextStroke: `${hookOutlineWidth}px ${hookOutlineColor}`,
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
              className="absolute left-0 right-0 px-4 z-10 pointer-events-none"
              style={{ top: `${project.styling.subtitleYPosition}%`, transform: "translateY(-50%)" }}
            >
              <p
                className="leading-tight"
                style={{
                  color: subStyle.color,
                  fontFamily: subStyle.fontFamily,
                  fontSize: `${Math.min(subStyle.fontSize * 0.5, 16)}px`,
                  textAlign: project.styling.subtitleXPosition,
                  textShadow: subStyle.backgroundColor === "transparent" ? "1px 1px 4px rgba(0,0,0,0.8)" : "none",
                  backgroundColor: subStyle.backgroundColor !== "transparent" ? subStyle.backgroundColor : undefined,
                  padding: subStyle.backgroundColor !== "transparent" ? "3px 8px" : undefined,
                  borderRadius: 4,
                }}
              >
                {subStyle.preview}
              </p>
            </div>
          )}

          {/* CTA overlay */}
          {ctaText && (
            <div
              className="absolute left-0 right-0 px-4 z-10 pointer-events-none"
              style={{ top: `${project.styling.ctaYPosition}%`, transform: "translateY(-50%)" }}
            >
              <div style={{ textAlign: project.styling.ctaXPosition }}>
                <span
                  className="inline-block px-5 py-2 rounded-full font-semibold text-sm"
                  style={{
                    color: ctaColor,
                    fontFamily: ctaFont,
                    background: ctaBoxColor !== "transparent" ? ctaBoxColor : "linear-gradient(135deg, #3B82F6, #22D3EE, #14B8A6)",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {ctaText}
                </span>
              </div>
            </div>
          )}

          {/* Play/Pause tap area */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center"
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

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-3 w-full">
          <Button
            onClick={handleDownload}
            className="flex-1 gradient-bg text-foreground border-0 hover:opacity-90 gap-2 h-10"
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

        {/* Close button */}
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
