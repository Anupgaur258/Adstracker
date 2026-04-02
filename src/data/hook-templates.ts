import { HookTemplate } from "@/types";

export const hookTemplates: HookTemplate[] = [
  {
    id: "ht1",
    name: "Classic Fade",
    description: "Smooth fade-in at the top of the video",
    position: "top",
    animation: "fade",
  },
  {
    id: "ht2",
    name: "Center Stage",
    description: "Bold center text that slides up into view",
    position: "center",
    animation: "slide-up",
  },
  {
    id: "ht3",
    name: "Drop Down",
    description: "Text slides down from above",
    position: "top",
    animation: "slide-down",
  },
  {
    id: "ht4",
    name: "Pop In",
    description: "Text scales in with a bouncy effect",
    position: "center",
    animation: "scale",
  },
  {
    id: "ht5",
    name: "Typewriter",
    description: "Characters appear one by one",
    position: "bottom",
    animation: "typewriter",
  },
  {
    id: "ht6",
    name: "Bounce Entry",
    description: "Text bounces in from below",
    position: "bottom",
    animation: "bounce",
  },
];
