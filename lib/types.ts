export type ThemeId =
  | "obsidian"
  | "arctic"
  | "midnight"
  | "sand"
  | "forest"
  | "graphite"
  | "rose"
  | "blueprint";

export type FontId =
  | "sf-pro"
  | "inter"
  | "geist"
  | "sora"
  | "dm-sans"
  | "satoshi"
  | "editorial"
  | "haas";

export type Role =
  | "ceo"
  | "cto"
  | "cfo"
  | "director"
  | "manager"
  | "senior_lead"
  | "lead"
  | "member"
  | "viewer"
  | "client"
  | "contractor"
  | "ai_agent";

export type ProjectPhase =
  | "Concept"
  | "Schematic"
  | "Design Dev"
  | "Documentation"
  | "Construction"
  | "Handover";

export type ProjectStatus = "On Track" | "At Risk" | "Blocked" | "Review";

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  type: string;
  location: string;
  phase: ProjectPhase;
  status: ProjectStatus;
  lead: string;
  budget: number;
  spent: number;
  margin: number;
  completion: number;
  dueInDays: number;
  risk: string;
  cover: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  capacity: number;
  utilization: number;
  availability: "Available" | "Focused" | "Overallocated" | "Leave";
  skills: string[];
};

export type Asset = {
  id: string;
  name: string;
  type: string;
  project: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published";
  tags: string[];
  updated: string;
};

export type AiAgent = {
  id: string;
  name: string;
  cadence: string;
  status: "Watching" | "Running" | "Paused";
  lastRun: string;
  spend: number;
  signal: string;
};
