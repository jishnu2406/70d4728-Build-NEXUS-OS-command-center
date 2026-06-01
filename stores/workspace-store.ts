"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SetupStepId = "identity" | "teams" | "modules" | "data" | "launch";

export type WorkspaceProfile = {
  companyName: string;
  companyType: string;
  region: string;
  currency: string;
  brandColor: string;
};

export type WorkspaceTeam = {
  ownerEmail: string;
  financeEmail: string;
  projectLeadEmail: string;
  defaultRole: string;
};

export type WorkspaceImports = {
  projectSource: string;
  assetSource: string;
  invoiceSource: string;
  knowledgeSource: string;
};

export type WorkspaceLaunch = {
  ssoProvider: string;
  twoFactor: string;
  aiBudget: string;
  goLiveDate: string;
};

type WorkspaceState = {
  profile: WorkspaceProfile;
  team: WorkspaceTeam;
  enabledModules: string[];
  imports: WorkspaceImports;
  launch: WorkspaceLaunch;
  completedSteps: SetupStepId[];
  lastUpdatedAt?: string;
  updateProfile: (profile: Partial<WorkspaceProfile>) => void;
  updateTeam: (team: Partial<WorkspaceTeam>) => void;
  setEnabledModules: (enabledModules: string[]) => void;
  updateImports: (imports: Partial<WorkspaceImports>) => void;
  updateLaunch: (launch: Partial<WorkspaceLaunch>) => void;
  completeStep: (step: SetupStepId) => void;
  clearStep: (step: SetupStepId) => void;
  resetWorkspace: () => void;
};

export const defaultProfile: WorkspaceProfile = {
  companyName: "",
  companyType: "",
  region: "",
  currency: "",
  brandColor: "#6c63ff",
};

export const defaultTeam: WorkspaceTeam = {
  ownerEmail: "",
  financeEmail: "",
  projectLeadEmail: "",
  defaultRole: "",
};

export const defaultImports: WorkspaceImports = {
  projectSource: "",
  assetSource: "",
  invoiceSource: "",
  knowledgeSource: "",
};

export const defaultLaunch: WorkspaceLaunch = {
  ssoProvider: "",
  twoFactor: "",
  aiBudget: "",
  goLiveDate: "",
};

export const setupStepIds: SetupStepId[] = ["identity", "teams", "modules", "data", "launch"];

function stamp() {
  return new Date().toISOString();
}

const freshWorkspace = {
  profile: defaultProfile,
  team: defaultTeam,
  enabledModules: [],
  imports: defaultImports,
  launch: defaultLaunch,
  completedSteps: [] as SetupStepId[],
  lastUpdatedAt: undefined,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...freshWorkspace,
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
          lastUpdatedAt: stamp(),
        })),
      updateTeam: (team) =>
        set((state) => ({
          team: { ...state.team, ...team },
          lastUpdatedAt: stamp(),
        })),
      setEnabledModules: (enabledModules) =>
        set({
          enabledModules,
          lastUpdatedAt: stamp(),
        }),
      updateImports: (imports) =>
        set((state) => ({
          imports: { ...state.imports, ...imports },
          lastUpdatedAt: stamp(),
        })),
      updateLaunch: (launch) =>
        set((state) => ({
          launch: { ...state.launch, ...launch },
          lastUpdatedAt: stamp(),
        })),
      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
          lastUpdatedAt: stamp(),
        })),
      clearStep: (step) =>
        set((state) => {
          const next: Partial<WorkspaceState> = {
            completedSteps: state.completedSteps.filter((item) => item !== step),
            lastUpdatedAt: stamp(),
          };

          if (step === "identity") next.profile = defaultProfile;
          if (step === "teams") next.team = defaultTeam;
          if (step === "modules") next.enabledModules = [];
          if (step === "data") next.imports = defaultImports;
          if (step === "launch") next.launch = defaultLaunch;

          return next;
        }),
      resetWorkspace: () => set({ ...freshWorkspace }),
    }),
    {
      name: "nexus-os-workspace-setup",
      partialize: ({
        profile,
        team,
        enabledModules,
        imports,
        launch,
        completedSteps,
        lastUpdatedAt,
      }) => ({
        profile,
        team,
        enabledModules,
        imports,
        launch,
        completedSteps,
        lastUpdatedAt,
      }),
    },
  ),
);

export function workspaceDisplayName(profile: WorkspaceProfile) {
  return profile.companyName.trim() || "New MNC Workspace";
}

export function workspaceProgress(completedSteps: SetupStepId[]) {
  return Math.round((completedSteps.length / setupStepIds.length) * 100);
}

export function workspaceTeamCount(team: WorkspaceTeam) {
  return [team.ownerEmail, team.financeEmail, team.projectLeadEmail].filter(Boolean).length;
}
