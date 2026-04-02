import { CTATemplate } from "@/types";

export const ctaTemplates: CTATemplate[] = [
  {
    id: "ct1",
    name: "Solid Button",
    description: "Clean solid button at bottom center",
    position: "bottom-center",
    animation: "fade",
    style: "solid",
  },
  {
    id: "ct2",
    name: "Outline Glow",
    description: "Outline button with a glow effect",
    position: "bottom-center",
    animation: "glow",
    style: "outline",
  },
  {
    id: "ct3",
    name: "Gradient Pill",
    description: "Gradient pill-shaped button that slides up",
    position: "bottom-center",
    animation: "slide-up",
    style: "gradient",
  },
  {
    id: "ct4",
    name: "Pulsing CTA",
    description: "Button that pulses to grab attention",
    position: "bottom-right",
    animation: "pulse",
    style: "pill",
  },
  {
    id: "ct5",
    name: "Minimal Float",
    description: "Minimal text CTA that fades in",
    position: "bottom-center",
    animation: "fade",
    style: "minimal",
  },
  {
    id: "ct6",
    name: "Full Width Bar",
    description: "Full-width bar at the bottom",
    position: "full-width",
    animation: "slide-up",
    style: "solid",
  },
];
