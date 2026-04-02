"use client";

import { useProjectStore } from "@/stores/project-store";
import { demoVideos } from "@/data/demo-videos";
import { LIMITS, ACCEPTED_VIDEO_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UploadedVideo } from "@/types";
import { Check, Play, Upload, X, FileVideo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCallback, useRef, useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Demo";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateThumbnail(file: File): Promise<{ thumbnailUrl: string; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
      const duration = Math.round(video.duration);
      URL.revokeObjectURL(objectUrl);
      resolve({ thumbnailUrl, duration });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ thumbnailUrl: "", duration: 0 });
    };
  });
}

const visibleDemos = demoVideos.slice(0, 5);

export function StepVideos() {
  const { wizardState, updateWizardState } = useProjectStore();
  const videos = wizardState.videos;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVideo = useCallback(
    (video: UploadedVideo) => {
      if (videos.length >= LIMITS.maxVideos) {
        toast.error(`Maximum ${LIMITS.maxVideos} videos allowed`);
        return;
      }
      updateWizardState({ videos: [...videos, video] });
    },
    [videos, updateWizardState]
  );

  const removeVideo = useCallback(
    (id: string) => {
      const video = videos.find((v) => v.id === id);
      if (video) {
        if (video.objectUrl.startsWith("blob:")) {
          URL.revokeObjectURL(video.objectUrl);
        }
        if (video.thumbnailUrl.startsWith("blob:")) {
          URL.revokeObjectURL(video.thumbnailUrl);
        }
      }
      updateWizardState({ videos: videos.filter((v) => v.id !== id) });
    },
    [videos, updateWizardState]
  );

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const remaining = LIMITS.maxVideos - videos.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${LIMITS.maxVideos} videos allowed`);
        return;
      }
      const toProcess = fileArr.slice(0, remaining);

      for (const file of toProcess) {
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type as typeof ACCEPTED_VIDEO_TYPES[number])) {
          toast.error(`"${file.name}" is not a supported format`);
          continue;
        }
        const objectUrl = URL.createObjectURL(file);
        const { thumbnailUrl, duration } = await generateThumbnail(file);
        const video: UploadedVideo = {
          id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          objectUrl,
          thumbnailUrl,
          duration,
        };
        addVideo(video);
      }
    },
    [videos.length, addVideo]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processFiles]
  );

  const toggleDemoVideo = useCallback(
    (demo: UploadedVideo) => {
      const exists = videos.some((v) => v.id === demo.id);
      if (exists) {
        removeVideo(demo.id);
      } else {
        addVideo(demo);
      }
    },
    [videos, addVideo, removeVideo]
  );

  const projectName = wizardState.projectName;
  const [nameTouched, setNameTouched] = useState(false);
  const showNameError = nameTouched && !projectName.trim();

  return (
    <div className="space-y-4">
      {/* Project Name - prominent at top */}
      <div className="space-y-1.5">
        <label className="text-xl text-foreground font-bold block">Project Name</label>
        <Input
          value={projectName}
          onChange={(e) => updateWizardState({ projectName: e.target.value })}
          onBlur={() => setNameTouched(true)}
          placeholder="Project Name"
          className={`h-10 bg-muted text-base focus:border-brand-purple max-w-md ${showNameError ? "border-red-500/50" : "border-border"}`}
        />
        {showNameError && (
          <p className="text-[11px] text-red-400">Project name is required to proceed</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">Select Videos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your own or choose from demo videos.{" "}
          <span className="text-brand-purple font-medium">
            {videos.length}/{LIMITS.maxVideos} selected
          </span>
        </p>
      </div>

      {/* Upload zone - compact */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border hover:border-brand-purple/40 rounded-xl p-4 text-center transition-colors cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-4">
          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-brand-purple transition-colors shrink-0" />
          <div className="text-left">
            <p className="text-sm text-foreground font-medium">Drag & drop videos or browse files</p>
            <p className="text-xs text-muted-foreground">MP4, MOV, or WebM · 1080p · 9:16 vertical recommended</p>
          </div>
        </div>
      </div>

      {/* Selected / uploaded videos */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Your Videos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card overflow-hidden relative group"
              >
                <div className="aspect-[9/16] bg-zinc-900 relative">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileVideo className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground truncate">{video.name}</p>
                  <p className="text-[10px] text-muted-foreground">{video.duration}s · {formatFileSize(video.size)}</p>
                </div>
                <button
                  onClick={() => removeVideo(video.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-red-500/80 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Demo videos */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Or use demo videos</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {visibleDemos.map((demo, index) => {
            const isSelected = videos.some((v) => v.id === demo.id);
            return (
              <motion.button
                key={demo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleDemoVideo(demo)}
                className={cn(
                  "glass-card-hover relative overflow-hidden text-left group border-2",
                  isSelected ? "border-brand-purple" : "border-transparent"
                )}
              >
                <div className="aspect-[9/16] bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 relative">
                  {demo.thumbnailUrl && (
                    <img src={demo.thumbnailUrl} alt={demo.name} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <video
                    src={demo.objectUrl}
                    poster={demo.thumbnailUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="none"
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                      v.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white/60 z-10 group-hover:scale-110 transition-transform" />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full gradient-bg flex items-center justify-center z-10"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-foreground text-xs truncate">{demo.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{demo.duration}s</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
