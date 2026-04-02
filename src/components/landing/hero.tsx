"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full gradient-bg" />
              Scale your video ad creative 100x
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Create{" "}
              <span className="gradient-text">120+ Video Ads</span>
              {" "}in Minutes
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Combine your videos with hooks, CTAs, and subtitle styles.
              Adstacker generates every possible combination automatically.
            </p>

            <div className="flex items-center justify-center gap-4 mt-10">
              <Button render={<Link href="/signup" />} size="lg" className="gradient-bg text-white border-0 hover:opacity-90 gap-2 h-12 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button render={<Link href="#how-it-works" />} variant="outline" size="lg" className="bg-muted border-border hover:bg-accent gap-2 h-12 px-8">
                <Play className="h-4 w-4" />
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 glass-card p-3 glow-purple"
          >
            <div className="aspect-video bg-gradient-to-br from-popover to-background rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-6 opacity-60">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-gradient-to-br from-brand-purple/10 to-brand-blue/5 flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
              <div className="relative z-10 text-center">
                <p className="text-6xl font-bold gradient-text">120+</p>
                <p className="text-sm text-muted-foreground mt-1">Video Variations Generated</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
