"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 text-center gradient-border glow-purple"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to <span className="gradient-text">Scale Your Ads</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of marketers creating hundreds of video variations in minutes, not days.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button render={<Link href="/signup" />} size="lg" className="gradient-bg text-white border-0 hover:opacity-90 gap-2 h-12 px-8">
              Start Creating for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button render={<Link href="/pricing" />} variant="outline" size="lg" className="bg-muted border-border hover:bg-accent h-12 px-8">
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
