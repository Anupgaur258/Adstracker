import { LayoutTemplate } from "@/types";

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: "lt1",
    name: "Portrait (9:16)",
    description: "Vertical video for TikTok, Reels, and Shorts",
    aspectRatio: "9:16",
  },
  {
    id: "lt2",
    name: "Landscape (16:9)",
    description: "Horizontal video for YouTube and ads",
    aspectRatio: "16:9",
  },
  {
    id: "lt3",
    name: "Square (1:1)",
    description: "Square format for Instagram feed and Facebook",
    aspectRatio: "1:1",
  },
  {
    id: "lt4",
    name: "Vertical Feed (4:5)",
    description: "Slightly taller for Instagram and Facebook feed",
    aspectRatio: "4:5",
  },
];
