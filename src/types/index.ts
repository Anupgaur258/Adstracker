export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "pending" | "generating" | "completed" | "failed";
  videos: VideoSource[];
  hooks: string[];
  ctas: string[];
  subtitleStyles: string[];
  hookTemplates: string[];
  ctaTemplates: string[];
  layoutTemplate: string;
  styling: ProjectStyling;
  hookColors: string[];
  hookFonts: string[];
  hookFontSizes: number[];
  ctaColors: string[];
  ctaFonts: string[];
  ctaFontSizes: number[];
  hookBoxColors: string[];
  hookOutlineColors: string[];
  hookOutlineWidths: number[];
  ctaBoxColors: string[];
  ctaOutlineColors: string[];
  ctaOutlineWidths: number[];
  generatedVideos: GeneratedVideo[];
  totalVideos: number;
  completedVideos: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  duration: number;
}

export interface UploadedVideo {
  id: string;
  name: string;
  size: number;
  type: string;
  objectUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export interface GeneratedVideo {
  id: string;
  projectId: string;
  videoSourceId: string;
  hookIndex: number;
  ctaIndex: number;
  subtitleStyleId: string;
  status: "pending" | "processing" | "completed" | "failed";
  outputUrl?: string;
  thumbnail?: string;
  label: string;
}

export interface ProjectStyling {
  hookDuration: number;
  ctaDuration: number;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  shadowEnabled: boolean;
  wordsPerLine: number;
  hookXPosition: "left" | "center" | "right";
  ctaXPosition: "left" | "center" | "right";
  subtitleXPosition: "left" | "center" | "right";
  hookYPosition: number;
  ctaYPosition: number;
  subtitleYPosition: number;
  subtitleFontColor: string;
  subtitleShadowColor: string;
  subtitleShadowBlur: number;
  subtitleBackgroundColor: string;
}

export interface HookTemplate {
  id: string;
  name: string;
  description: string;
  position: "top" | "center" | "bottom";
  animation: "fade" | "slide-up" | "slide-down" | "scale" | "typewriter" | "bounce";
  preview?: string;
}

export interface CTATemplate {
  id: string;
  name: string;
  description: string;
  position: "bottom-center" | "bottom-right" | "center" | "top-right" | "bottom-left" | "full-width";
  animation: "fade" | "slide-up" | "pulse" | "bounce" | "glow" | "shake";
  style: "solid" | "outline" | "gradient" | "pill" | "rounded" | "minimal";
}

export interface SubtitleStyle {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: "bottom" | "center" | "top";
  animation: "word-by-word" | "line-by-line" | "karaoke" | "pop" | "fade" | "none";
  preview: string;
  font?: string;
  animationLabel?: string;
  description?: string;
  highlightColor?: string;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  aspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
  preview?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  credits: number | "unlimited";
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface WizardState {
  currentStep: number;
  projectName: string;
  videos: UploadedVideo[];
  hooks: string[];
  ctas: string[];
  selectedSubtitleStyles: string[];
  hookTemplates: string[];
  ctaTemplates: string[];
  selectedLayoutTemplate: string;
  styling: ProjectStyling;
  hookColors: string[];
  hookFonts: string[];
  hookFontSizes: number[];
  ctaColors: string[];
  ctaFonts: string[];
  ctaFontSizes: number[];
  hookBoxColors: string[];
  hookOutlineColors: string[];
  hookOutlineWidths: number[];
  ctaBoxColors: string[];
  ctaOutlineColors: string[];
  ctaOutlineWidths: number[];
}

export type GenerationStatus = "idle" | "generating" | "completed" | "failed";
