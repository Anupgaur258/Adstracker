export const BRAND_COLORS = {
  purple: "#8B5CF6",
  blue: "#3B82F6",
  cyan: "#22D3EE",
  teal: "#14B8A6",
  accent: "#5DD9C1",
  navy: "#0F1221",
  card: "#141832",
  elevated: "#1A1F3D",
} as const;

export const GRADIENT = "linear-gradient(135deg, #8B5CF6, #3B82F6, #22D3EE, #14B8A6)";

export const LIMITS = {
  maxVideos: 4,
  maxHooks: 5,
  maxCtas: 3,
  maxSubtitleStyles: 2,
  hookMaxChars: 80,
  ctaMaxChars: 30,
} as const;

export const CTA_SUGGESTIONS = [
  "Shop Now",
  "Learn More",
  "Sign Up Free",
  "Get Started",
  "Download Now",
  "Try It Free",
  "Book a Demo",
  "Claim Offer",
  "Watch More",
  "Subscribe",
] as const;

export const FONT_OPTIONS = [
  "Inter",
  "Montserrat",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Noto Sans",
  "Oswald",
  "Playfair Display",
  "Raleway",
  "Bangers",
] as const;

export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"] as const;
