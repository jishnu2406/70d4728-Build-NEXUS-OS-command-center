import type { AiAgent, Asset, Project, TeamMember } from "@/lib/types";

export const organization = {
  name: "New MNC Workspace",
  slug: "new-workspace",
  plan: "Setup",
  type: "Unconfigured",
  aiBudget: 0,
  aiSpend: 0,
  health: 0,
  setupProgress: 0,
};

export const dashboardStats = [
  { label: "Projects", value: "0", delta: "ready", tone: "neutral" },
  { label: "Team", value: "0", delta: "invite", tone: "neutral" },
  { label: "Assets", value: "0", delta: "upload", tone: "neutral" },
  { label: "AI Agents", value: "0", delta: "configure", tone: "neutral" },
];

export const revenueSeries = [
  { month: "M1", revenue: 0, forecast: 0 },
  { month: "M2", revenue: 0, forecast: 0 },
  { month: "M3", revenue: 0, forecast: 0 },
  { month: "M4", revenue: 0, forecast: 0 },
  { month: "M5", revenue: 0, forecast: 0 },
  { month: "M6", revenue: 0, forecast: 0 },
];

export const utilizationSeries = [
  { department: "Studio", utilization: 0, capacity: 0 },
  { department: "Operations", utilization: 0, capacity: 0 },
  { department: "Finance", utilization: 0, capacity: 0 },
  { department: "Clients", utilization: 0, capacity: 0 },
];

export const projects: Project[] = [];

export const team: TeamMember[] = [];

export const assets: Asset[] = [];

export const aiAgents: AiAgent[] = [];

export const notifications: string[] = [];

export const setupSteps = [
  {
    id: "identity",
    title: "Name the MNC",
    description: "Set company name, type, logo, region, currency, and brand color.",
    status: "Ready",
  },
  {
    id: "teams",
    title: "Invite the leadership team",
    description: "Add CEO, directors, finance, project leads, members, clients, and contractors.",
    status: "Ready",
  },
  {
    id: "modules",
    title: "Choose modules",
    description: "Enable architecture, interiors, production, brand, finance, client portal, and AI.",
    status: "Ready",
  },
  {
    id: "data",
    title: "Import company data",
    description: "Bring projects, assets, invoices, knowledge, and people from existing tools.",
    status: "Ready",
  },
  {
    id: "launch",
    title: "Launch workspace",
    description: "Review permissions, integrations, billing, and AI model budgets before going live.",
    status: "Ready",
  },
];

export const emptyModules = [
  { label: "Projects", value: "0", helper: "Create or import projects" },
  { label: "People", value: "0", helper: "Invite users and assign roles" },
  { label: "Assets", value: "0", helper: "Upload files and templates" },
  { label: "Finance", value: "$0", helper: "Connect billing and invoices" },
];
