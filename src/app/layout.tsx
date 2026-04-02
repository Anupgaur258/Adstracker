import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/common/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adstacker - Create 120+ Video Ads in Minutes",
  description:
    "Combine videos, hooks, CTAs, and subtitle styles to generate hundreds of video ad variations automatically.",
};

const googleFontFamilies = [
  "Inter:wght@400;500;600;700",
  "Montserrat:wght@400;500;600;700",
  "Poppins:wght@400;500;600;700",
  "Roboto:wght@400;500;700",
  "Open+Sans:wght@400;600;700",
  "Noto+Sans:wght@400;500;600;700",
  "Oswald:wght@400;500;600;700",
  "Playfair+Display:wght@400;600;700",
  "Raleway:wght@400;500;600;700",
  "Bangers",
  "Impact",
].join("&family=");

const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${googleFontFamilies}&display=swap`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-card border-border text-foreground",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
