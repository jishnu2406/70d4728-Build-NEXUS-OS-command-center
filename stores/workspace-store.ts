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

export type WorkspaceProject = {
  id: string;
  name: string;
  phase: string;
  client: string;
  location: string;
  budget: string;
  startDate: string;
  status: string;
};

export type WorkspaceEmployee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
};

export type WorkspaceAsset = {
  id: string;
  name: string;
  category: string;
  owner: string;
  source: string;
};

export type WorkspaceInvoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
  status: string;
};

export type WorkspaceClient = {
  id: string;
  name: string;
  contact: string;
  email: string;
  project: string;
};

export type WorkspaceAiAgent = {
  id: string;
  name: string;
  purpose: string;
  budget: string;
};

type WorkspaceState = {
  profile: WorkspaceProfile;
  team: WorkspaceTeam;
  enabledModules: string[];
  imports: WorkspaceImports;
  launch: WorkspaceLaunch;
  completedSteps: SetupStepId[];
  launchedAt?: string;
  projects: WorkspaceProject[];
  employees: WorkspaceEmployee[];
  assets: WorkspaceAsset[];
  invoices: WorkspaceInvoice[];
  clients: WorkspaceClient[];
  aiAgents: WorkspaceAiAgent[];
  lastUpdatedAt?: string;
  updateProfile: (profile: Partial<WorkspaceProfile>) => void;
  updateTeam: (team: Partial<WorkspaceTeam>) => void;
  setEnabledModules: (enabledModules: string[]) => void;
  updateImports: (imports: Partial<WorkspaceImports>) => void;
  updateLaunch: (launch: Partial<WorkspaceLaunch>) => void;
  completeStep: (step: SetupStepId) => void;
  clearStep: (step: SetupStepId) => void;
  launchWorkspace: () => void;
  addProject: (project: Omit<WorkspaceProject, "id" | "status">) => void;
  addEmployee: (employee: Omit<WorkspaceEmployee, "id">) => void;
  addAsset: (asset: Omit<WorkspaceAsset, "id">) => void;
  addInvoice: (invoice: Omit<WorkspaceInvoice, "id" | "status">) => void;
  addClient: (client: Omit<WorkspaceClient, "id">) => void;
  addAiAgent: (agent: Omit<WorkspaceAiAgent, "id">) => void;
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
  launchedAt: undefined,
  projects: [] as WorkspaceProject[],
  employees: [] as WorkspaceEmployee[],
  assets: [] as WorkspaceAsset[],
  invoices: [] as WorkspaceInvoice[],
  clients: [] as WorkspaceClient[],
  aiAgents: [] as WorkspaceAiAgent[],
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
          if (step === "launch") {
            next.launch = defaultLaunch;
            next.launchedAt = undefined;
          }

          return next;
        }),
      launchWorkspace: () =>
        set((state) => ({
          completedSteps: state.completedSteps.includes("launch")
            ? state.completedSteps
            : [...state.completedSteps, "launch"],
          launchedAt: state.launchedAt ?? stamp(),
          lastUpdatedAt: stamp(),
        })),
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: crypto.randomUUID(),
              status: "Active",
              ...project,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
      addEmployee: (employee) =>
        set((state) => ({
          employees: [
            ...state.employees,
            {
              id: crypto.randomUUID(),
              ...employee,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
      addAsset: (asset) =>
        set((state) => ({
          assets: [
            ...state.assets,
            {
              id: crypto.randomUUID(),
              ...asset,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              id: crypto.randomUUID(),
              status: "Open",
              ...invoice,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              id: crypto.randomUUID(),
              ...client,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
      addAiAgent: (agent) =>
        set((state) => ({
          aiAgents: [
            ...state.aiAgents,
            {
              id: crypto.randomUUID(),
              ...agent,
            },
          ],
          lastUpdatedAt: stamp(),
        })),
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
        launchedAt,
        projects,
        employees,
        assets,
        invoices,
        clients,
        aiAgents,
        lastUpdatedAt,
      }) => ({
        profile,
        team,
        enabledModules,
        imports,
        launch,
        completedSteps,
        launchedAt,
        projects,
        employees,
        assets,
        invoices,
        clients,
        aiAgents,
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

export function workspaceIsLive(launchedAt?: string, completedSteps: SetupStepId[] = []) {
  return Boolean(launchedAt || completedSteps.includes("launch"));
}
