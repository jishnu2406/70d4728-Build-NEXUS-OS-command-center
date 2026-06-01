"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FontId, ThemeId } from "@/lib/types";

type Density = "compact" | "default" | "comfortable";

type PreferencesState = {
  theme: ThemeId;
  font: FontId;
  density: Density;
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  setTheme: (theme: ThemeId) => void;
  setFont: (font: FontId) => void;
  setDensity: (density: Density) => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "obsidian",
      font: "sf-pro",
      density: "default",
      sidebarCollapsed: false,
      aiPanelOpen: true,
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setDensity: (density) => set({ density }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
    }),
    {
      name: "nexus-os-preferences",
      partialize: ({ theme, font, density, sidebarCollapsed, aiPanelOpen }) => ({
        theme,
        font,
        density,
        sidebarCollapsed,
        aiPanelOpen,
      }),
    },
  ),
);
