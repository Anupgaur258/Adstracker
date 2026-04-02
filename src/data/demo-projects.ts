import { Project, GeneratedVideo, VideoSource } from "@/types";
import { subtitleStyles } from "@/data/subtitle-styles";

function generateCombinations(
  projectId: string,
  videos: VideoSource[],
  hooks: string[],
  ctas: string[],
  styleIds: string[],
  completedCount: number,
  projectStatus: Project["status"]
): GeneratedVideo[] {
  const result: GeneratedVideo[] = [];
  let index = 0;

  for (const video of videos) {
    for (let hi = 0; hi < hooks.length; hi++) {
      for (let ci = 0; ci < ctas.length; ci++) {
        for (const sid of styleIds) {
          const styleName = subtitleStyles.find((s) => s.id === sid)?.name ?? sid;
          const isCompleted = index < completedCount;
          result.push({
            id: `gv-${projectId}-${index}`,
            projectId,
            videoSourceId: video.id,
            hookIndex: hi,
            ctaIndex: ci,
            subtitleStyleId: sid,
            status: isCompleted ? "completed" : projectStatus === "generating" ? "processing" : "pending",
            label: `${video.name} + Hook ${hi + 1} + ${ctas[ci]} + ${styleName}`,
          });
          index++;
        }
      }
    }
  }

  return result;
}

const proj1Videos: VideoSource[] = [
  { id: "v1", name: "Urban City Life", url: "", thumbnail: "", duration: 15 },
  { id: "v2", name: "Nature Landscape", url: "", thumbnail: "", duration: 12 },
];
const proj1Hooks = [
  "Stop scrolling! This deal won't last!",
  "Your summer just got 50% better",
  "The sale everyone's talking about",
  "Don't miss out on these prices",
  "Limited time: Summer blowout sale",
];
const proj1Ctas = ["Shop Now", "Get 50% Off", "Claim Your Deal"];
const proj1Styles = ["hormozi", "abdal"];

const proj2Videos: VideoSource[] = [
  { id: "v4", name: "Fitness Motivation", url: "", thumbnail: "", duration: 20 },
  { id: "v3", name: "Tech Workspace", url: "", thumbnail: "", duration: 18 },
  { id: "v1", name: "Urban City Life", url: "", thumbnail: "", duration: 15 },
];
const proj2Hooks = [
  "Transform your body in 30 days",
  "The app that changed everything",
  "Ready to get fit? Start here",
  "Your personal trainer, in your pocket",
  "Join 1M+ users getting results",
];
const proj2Ctas = ["Download Free", "Start Training", "Try 7 Days Free"];
const proj2Styles = ["mrbeast", "tiktok-viral"];

export const demoProjects: Project[] = [
  {
    id: "proj-1",
    name: "Summer Sale Campaign",
    description: "Video ads for the summer sale promotion",
    status: "completed",
    videos: proj1Videos,
    hooks: proj1Hooks,
    ctas: proj1Ctas,
    subtitleStyles: proj1Styles,
    hookTemplates: ["ht2", "ht2", "ht2", "ht2", "ht2"],
    ctaTemplates: ["ct3", "ct3", "ct3"],
    layoutTemplate: "lt1",
    styling: {
      hookDuration: 3,
      ctaDuration: 4,
      fontSize: 28,
      fontFamily: "Inter",
      textColor: "#FFFFFF",
      shadowEnabled: true,
      wordsPerLine: 4,
      hookXPosition: "center",
      ctaXPosition: "center",
      subtitleXPosition: "center",
      hookYPosition: 8,
      ctaYPosition: 88,
      subtitleYPosition: 70,
      subtitleFontColor: "#FFFFFF",
      subtitleShadowColor: "rgba(0,0,0,0.5)",
      subtitleShadowBlur: 4,
      subtitleBackgroundColor: "transparent",
    },
    hookColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    hookFonts: ["Inter", "Inter", "Inter", "Inter", "Inter"],
    hookFontSizes: [28, 28, 28, 28, 28],
    ctaColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ctaFonts: ["Inter", "Inter", "Inter"],
    ctaFontSizes: [20, 20, 20],
    hookBoxColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineWidths: [0, 0, 0, 0, 0],
    ctaBoxColors: ["transparent", "transparent", "transparent"],
    ctaOutlineColors: ["transparent", "transparent", "transparent"],
    ctaOutlineWidths: [0, 0, 0],
    generatedVideos: generateCombinations("proj-1", proj1Videos, proj1Hooks, proj1Ctas, proj1Styles, 60, "completed"),
    totalVideos: 60,
    completedVideos: 60,
    createdAt: "2025-03-15T10:30:00Z",
    updatedAt: "2025-03-15T12:45:00Z",
  },
  {
    id: "proj-2",
    name: "Fitness App Launch",
    description: "Launch campaign for the new fitness tracking app",
    status: "generating",
    videos: proj2Videos,
    hooks: proj2Hooks,
    ctas: proj2Ctas,
    subtitleStyles: proj2Styles,
    hookTemplates: ["ht4", "ht4", "ht4", "ht4", "ht4"],
    ctaTemplates: ["ct1", "ct1", "ct1"],
    layoutTemplate: "lt1",
    styling: {
      hookDuration: 3,
      ctaDuration: 5,
      fontSize: 26,
      fontFamily: "Montserrat",
      textColor: "#22D3EE",
      shadowEnabled: true,
      wordsPerLine: 3,
      hookXPosition: "center",
      ctaXPosition: "center",
      subtitleXPosition: "center",
      hookYPosition: 8,
      ctaYPosition: 88,
      subtitleYPosition: 70,
      subtitleFontColor: "#FFFFFF",
      subtitleShadowColor: "rgba(0,0,0,0.5)",
      subtitleShadowBlur: 4,
      subtitleBackgroundColor: "transparent",
    },
    hookColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    hookFonts: ["Montserrat", "Montserrat", "Montserrat", "Montserrat", "Montserrat"],
    hookFontSizes: [28, 28, 28, 28, 28],
    ctaColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ctaFonts: ["Montserrat", "Montserrat", "Montserrat"],
    ctaFontSizes: [20, 20, 20],
    hookBoxColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineWidths: [0, 0, 0, 0, 0],
    ctaBoxColors: ["transparent", "transparent", "transparent"],
    ctaOutlineColors: ["transparent", "transparent", "transparent"],
    ctaOutlineWidths: [0, 0, 0],
    generatedVideos: generateCombinations("proj-2", proj2Videos, proj2Hooks, proj2Ctas, proj2Styles, 45, "generating"),
    totalVideos: 90,
    completedVideos: 45,
    createdAt: "2025-03-28T08:00:00Z",
    updatedAt: "2025-03-28T09:15:00Z",
  },
  {
    id: "proj-3",
    name: "Product Review Series",
    description: "Video reviews for the tech product line",
    status: "draft",
    videos: [
      { id: "v3", name: "Tech Workspace", url: "", thumbnail: "", duration: 18 },
    ],
    hooks: [
      "Honest review: Is it worth it?",
      "Before you buy, watch this",
      "The truth about this product",
      "I tested it for 30 days",
      "Unboxing + full review",
    ],
    ctas: ["Watch Full Review", "Subscribe", "See Price"],
    subtitleStyles: ["hormozi", "clean-corporate"],
    hookTemplates: ["ht1", "ht1", "ht1", "ht1", "ht1"],
    ctaTemplates: ["ct5", "ct5", "ct5"],
    layoutTemplate: "lt2",
    styling: {
      hookDuration: 4,
      ctaDuration: 3,
      fontSize: 24,
      fontFamily: "Inter",
      textColor: "#FFFFFF",
      shadowEnabled: false,
      wordsPerLine: 5,
      hookXPosition: "center",
      ctaXPosition: "center",
      subtitleXPosition: "center",
      hookYPosition: 8,
      ctaYPosition: 88,
      subtitleYPosition: 70,
      subtitleFontColor: "#FFFFFF",
      subtitleShadowColor: "rgba(0,0,0,0.5)",
      subtitleShadowBlur: 4,
      subtitleBackgroundColor: "transparent",
    },
    hookColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    hookFonts: ["Inter", "Inter", "Inter", "Inter", "Inter"],
    hookFontSizes: [28, 28, 28, 28, 28],
    ctaColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
    ctaFonts: ["Inter", "Inter", "Inter"],
    ctaFontSizes: [20, 20, 20],
    hookBoxColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
    hookOutlineWidths: [0, 0, 0, 0, 0],
    ctaBoxColors: ["transparent", "transparent", "transparent"],
    ctaOutlineColors: ["transparent", "transparent", "transparent"],
    ctaOutlineWidths: [0, 0, 0],
    generatedVideos: [],
    totalVideos: 30,
    completedVideos: 0,
    createdAt: "2025-04-01T14:00:00Z",
    updatedAt: "2025-04-01T14:00:00Z",
  },
];
