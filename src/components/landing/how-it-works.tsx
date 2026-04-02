"use client";

import { motion } from "framer-motion";
import { Upload, Settings2, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Videos",
    description: "Select up to 4 base videos. Use stock footage or upload your own content.",
  },
  {
    icon: Settings2,
    step: "02",
    title: "Configure Overlays",
    description: "Write hooks and CTAs, pick subtitle styles, choose templates, and customize styling.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Generate & Download",
    description: "Adstacker creates every combination. Filter, preview, and download your video ads.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 mt-[-130px] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Three simple steps to create hundreds of video ad variations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                <step.icon className="h-8 w-8 text-brand-purple" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-bg text-[11px] font-bold text-white flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
