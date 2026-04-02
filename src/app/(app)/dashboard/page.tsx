"use client";

import { useProjectStore } from "@/stores/project-store";
import { useHydration } from "@/hooks/use-hydration";
import { ProjectCard } from "@/components/project/project-card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button render={<Link href="/projects/new" />} className="gradient-bg text-foreground border-0 hover:opacity-90 gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-brand-purple" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No projects yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            Create your first project to start generating hundreds of video ad variations.
          </p>
          <Button render={<Link href="/projects/new" />} className="gradient-bg text-foreground border-0 hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Project
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/projects/new"
              className="glass-card-hover flex flex-col items-center justify-center h-full min-h-[260px] border-2 border-dashed border-border hover:border-brand-purple/30 group"
            >
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                New Project
              </span>
            </Link>
          </motion.div>

          {/* Project Cards */}
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
