import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project, WizardState, ProjectStyling, UploadedVideo } from "@/types";
import { demoProjects } from "@/data/demo-projects";

const defaultStyling: ProjectStyling = {
  hookDuration: 3,
  ctaDuration: 4,
  fontSize: 26,
  fontFamily: "Inter",
  textColor: "#FFFFFF",
  shadowEnabled: true,
  wordsPerLine: 4,
  hookXPosition: "center",
  ctaXPosition: "center",
  subtitleXPosition: "center",
  hookYPosition: 8,
  ctaYPosition: 88,
  subtitleYPosition: 70,
  subtitleFontColor: "#FFFFFF",
  subtitleShadowColor: "rgba(0,0,0,0.5)",
  subtitleShadowBlur: 4,
  subtitleBackgroundColor: "transparent",
};

const defaultWizardState: WizardState = {
  currentStep: 0,
  projectName: "",
  videos: [],
  hooks: ["", "", "", "", ""],
  ctas: ["", "", ""],
  selectedSubtitleStyles: [],
  hookTemplates: ["ht1", "ht1", "ht1", "ht1", "ht1"],
  ctaTemplates: ["ct1", "ct1", "ct1"],
  selectedLayoutTemplate: "lt1",
  styling: defaultStyling,
  hookColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
  hookFonts: ["Inter", "Inter", "Inter", "Inter", "Inter"],
  hookFontSizes: [28, 28, 28, 28, 28],
  ctaColors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
  ctaFonts: ["Inter", "Inter", "Inter"],
  ctaFontSizes: [20, 20, 20],
  hookBoxColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
  hookOutlineColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
  hookOutlineWidths: [0, 0, 0, 0, 0],
  ctaBoxColors: ["transparent", "transparent", "transparent"],
  ctaOutlineColors: ["transparent", "transparent", "transparent"],
  ctaOutlineWidths: [0, 0, 0],
};

interface ProjectState {
  projects: Project[];
  wizardState: WizardState;
  setWizardStep: (step: number) => void;
  updateWizardState: (updates: Partial<WizardState>) => void;
  resetWizard: () => void;
  createProject: (name: string) => string;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
}

function revokeVideoUrls(videos: UploadedVideo[]) {
  for (const v of videos) {
    if (v.objectUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(v.objectUrl); } catch {}
    }
    if (v.thumbnailUrl.startsWith("blob:")) {
      try { URL.revokeObjectURL(v.thumbnailUrl); } catch {}
    }
  }
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: demoProjects,
      wizardState: defaultWizardState,
      setWizardStep: (step: number) =>
        set((state) => ({
          wizardState: { ...state.wizardState, currentStep: step },
        })),
      updateWizardState: (updates: Partial<WizardState>) =>
        set((state) => ({
          wizardState: { ...state.wizardState, ...updates },
        })),
      resetWizard: () => {
        const state = get();
        revokeVideoUrls(state.wizardState.videos);
        set({ wizardState: defaultWizardState });
      },
      createProject: (name: string) => {
        const state = get();
        const w = state.wizardState;
        const filledHooks = w.hooks.filter((h) => h.trim());
        const filledCtas = w.ctas.filter((c) => c.trim());
        const totalVideos =
          w.videos.length *
          filledHooks.length *
          filledCtas.length *
          w.selectedSubtitleStyles.length;
        const id = `proj-${Date.now()}`;
        const newProject: Project = {
          id,
          name,
          status: "pending",
          videos: w.videos.map((v) => ({
            id: v.id,
            name: v.name,
            url: v.objectUrl,
            thumbnail: v.thumbnailUrl,
            duration: v.duration,
          })),
          hooks: filledHooks,
          ctas: filledCtas,
          subtitleStyles: w.selectedSubtitleStyles,
          hookTemplates: w.hookTemplates.slice(0, filledHooks.length),
          ctaTemplates: w.ctaTemplates.slice(0, filledCtas.length),
          layoutTemplate: w.selectedLayoutTemplate,
          styling: w.styling,
          hookColors: w.hookColors.slice(0, filledHooks.length),
          hookFonts: w.hookFonts.slice(0, filledHooks.length),
          hookFontSizes: w.hookFontSizes.slice(0, filledHooks.length),
          ctaColors: w.ctaColors.slice(0, filledCtas.length),
          ctaFonts: w.ctaFonts.slice(0, filledCtas.length),
          ctaFontSizes: w.ctaFontSizes.slice(0, filledCtas.length),
          hookBoxColors: w.hookBoxColors.slice(0, filledHooks.length),
          hookOutlineColors: w.hookOutlineColors.slice(0, filledHooks.length),
          hookOutlineWidths: w.hookOutlineWidths.slice(0, filledHooks.length),
          ctaBoxColors: w.ctaBoxColors.slice(0, filledCtas.length),
          ctaOutlineColors: w.ctaOutlineColors.slice(0, filledCtas.length),
          ctaOutlineWidths: w.ctaOutlineWidths.slice(0, filledCtas.length),
          generatedVideos: [],
          totalVideos,
          completedVideos: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [newProject, ...state.projects],
          wizardState: defaultWizardState,
        }));
        return id;
      },
      deleteProject: (id: string) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      updateProject: (id: string, updates: Partial<Project>) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      getProject: (id: string) => get().projects.find((p) => p.id === id),
    }),
    {
      name: "adstacker-projects",
      version: 8,
      migrate: (persisted: unknown, version: number) => {
        if (version < 8) {
          return {
            projects: demoProjects,
            wizardState: defaultWizardState,
          };
        }
        return persisted as ProjectState;
      },
    }
  )
);
