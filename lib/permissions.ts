import type { Role } from "@/lib/types";

export const PERMISSIONS: Record<Role, string[]> = {
  ceo: ["*"],
  cto: [
    "orgs:manage",
    "users:invite",
    "projects:*",
    "assets:*",
    "ai:configure",
    "reports:export",
    "security:manage",
    "admin:view",
  ],
  cfo: [
    "financials:view",
    "financials:manage",
    "billing:manage",
    "reports:export",
    "projects:view",
  ],
  director: [
    "projects:*",
    "people:manage",
    "assets:*",
    "reports:export",
    "ai:use",
    "clients:manage",
  ],
  manager: [
    "projects:create",
    "projects:update",
    "projects:view",
    "people:view",
    "assets:*",
    "ai:use",
    "clients:view",
  ],
  senior_lead: [
    "projects:update",
    "projects:view",
    "assets:create",
    "assets:update",
    "ai:use",
  ],
  lead: ["projects:update", "projects:view", "assets:view", "ai:use"],
  member: ["projects:view", "assets:view", "tasks:update", "ai:use"],
  viewer: ["projects:view", "assets:view"],
  client: ["portal:view", "portal:comment", "invoices:view"],
  contractor: ["projects:view", "tasks:update", "assets:view"],
  ai_agent: ["ai:act", "projects:view", "assets:view", "notifications:create"],
};

export function hasPermission(role: Role, permission: string) {
  const permissions = PERMISSIONS[role] ?? [];
  if (permissions.includes("*")) return true;
  if (permissions.includes(permission)) return true;

  const [scope] = permission.split(":");
  return permissions.includes(`${scope}:*`);
}

export const activeSession = {
  userId: "usr_ada",
  orgId: "org_new_workspace",
  orgSlug: "new-workspace",
  orgName: "New MNC Workspace",
  role: "ceo" as Role,
  permissions: PERMISSIONS.ceo,
};
