"use client";

import { motion } from "framer-motion";
import { Layers, Zap, Sliders, Download } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Stack & Combine",
    description: "Layer hooks, CTAs, and subtitle styles on any video. Every combination is generated automatically.",
    color: "text-brand-purple",
    bg: "bg-brand-purple/10",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate 120+ unique video ads from just 4 videos, 5 hooks, 3 CTAs, and 2 subtitle styles.",
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
  {
    icon: Sliders,
    title: "Full Customization",
    description: "Choose from 6+ templates for hooks, CTAs, and layouts. Fine-tune fonts, colors, timing, and effects.",
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
  },
  {
    icon: Download,
    title: "Browser-Based Export",
    description: "No server needed. Videos render right in your browser with ffmpeg.wasm. Download as MP4 instantly.",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 mt-[-130px] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything You Need to{" "}
            <span className="gradient-text">Scale Creative</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Stop manually editing videos one by one. Adstacker multiplies your creative output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
