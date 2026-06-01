"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Command,
  Database,
  LockKeyhole,
  Palette,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { setupSteps } from "@/lib/data";
import {
  type SetupStepId,
  setupStepIds,
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
  workspaceProgress,
  workspaceTeamCount,
} from "@/stores/workspace-store";

const moduleActions = [
  { href: "/projects", label: "Project workspace", icon: Building2 },
  { href: "/settings", label: "Brand workspace", icon: Palette },
  { href: "/people", label: "Invite team", icon: UsersRound },
  { href: "/assets", label: "Import data", icon: Database },
];

const platformPillars = [
  {
    icon: LockKeyhole,
    title: "Tenant isolated",
    text: "Every MNC starts with a clean workspace, role model, and data boundary.",
  },
  {
    icon: Cloud,
    title: "Vercel ready",
    text: "Frontend and API routes deploy together; database and keys are added per tenant.",
  },
  {
    icon: Sparkles,
    title: "AI optional",
    text: "NEXUS Mind stays quiet until the company connects model keys and budgets.",
  },
];

const setupRoutes = ["identity", "team", "modules", "import-data", "launch"];

export function CommandCenter() {
  const profile = useWorkspaceStore((state) => state.profile);
  const team = useWorkspaceStore((state) => state.team);
  const enabledModules = useWorkspaceStore((state) => state.enabledModules);
  const imports = useWorkspaceStore((state) => state.imports);
  const launch = useWorkspaceStore((state) => state.launch);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const projects = useWorkspaceStore((state) => state.projects);
  const employees = useWorkspaceStore((state) => state.employees);
  const workspaceName = workspaceDisplayName(profile);
  const progress = workspaceProgress(completedSteps);
  const teamCount = workspaceTeamCount(team);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const peopleTotal = teamCount + employees.length;
  const projectStatus = projects.length ? String(projects.length) : imports.projectSource ? "Ready" : "0";
  const assetStatus = imports.assetSource || imports.knowledgeSource ? "Connected" : "0";
  const aiStatus = enabledModules.includes("AI layer") ? "Enabled" : "Off";
  const moduleStats = [
    { label: "Projects", value: projectStatus, helper: projects[0]?.name || imports.projectSource || "Create or import projects" },
    { label: "Team", value: String(peopleTotal), helper: employees[0]?.department || team.defaultRole || "Invite users and assign roles" },
    { label: "Assets", value: assetStatus, helper: imports.assetSource || "Upload files and templates" },
    { label: "AI", value: aiStatus, helper: launch.aiBudget ? `${profile.currency || "$"} ${launch.aiBudget} budget` : "Configure AI rules" },
  ];

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-surface/72 backdrop-blur-2xl">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 md:p-10">
            <Badge tone={progress === 100 ? "positive" : "accent"}>
              {isLive ? "MNC workspace live" : "Fresh MNC setup"}
            </Badge>
            <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] text-text md:text-6xl">
              {isLive
                ? `${workspaceName} is live and ready for operations.`
                : profile.companyName
                ? `${workspaceName} command center is taking shape.`
                : "Set up a clean command center for any MNC."}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              {isLive
                ? "Start adding real projects, employees, files, clients, invoices, and AI rules. This workspace now moves from setup into daily work."
                : profile.companyName
                ? `${workspaceName} now carries its own identity, team plan, module choices, imports, and launch rules across the OS.`
                : "No sample projects. No demo clients. Each company begins with a private, empty workspace and builds its own structure, people, modules, and data."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/onboarding">
                  {isLive ? "Review launch settings" : progress > 0 ? "Resume workspace setup" : "Start workspace setup"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link href="/settings">Choose brand style</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              {moduleStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-border bg-panel/70 p-4"
                >
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">{item.helper}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-t border-border bg-panel/38 p-5 md:p-8 xl:border-l xl:border-t-0">
            <div className="mx-auto max-w-xl rounded-[24px] border border-border bg-surface/80 p-4 shadow-glass">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    Setup progress
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {progress === 100 ? "Ready for handoff" : `${progress}% configured`}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
                  <Command className="h-5 w-5" />
                </div>
              </div>
              <Progress value={progress} className="mb-5" tone={progress === 100 ? "positive" : "accent"} />
              <div className="space-y-2">
                {setupSteps.map((step, index) => (
                  <Link
                    key={step.id}
                    href={`/onboarding?step=${setupRoutes[index]}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-panel/70 p-4 transition hover:border-accent-2/45 hover:bg-panel"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xs text-muted">
                      {completedSteps.includes(setupStepIds[index] as SetupStepId) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text">{step.title}</p>
                      <p className="mt-1 truncate text-xs text-muted">{step.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-2" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[24px]">
          <CardHeader title="Workspace launchpad" eyebrow="Next actions" />
          <div className="grid gap-3 sm:grid-cols-2">
            {moduleActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-2xl border border-border bg-panel/75 p-4 transition hover:-translate-y-0.5 hover:border-accent-2/40"
                >
                  <Icon className="h-5 w-5 text-accent-2" />
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <ChevronRight className="h-4 w-4 text-muted group-hover:text-accent-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader title="Fresh by design" eyebrow="Enterprise defaults" />
          <div className="grid gap-3 md:grid-cols-3">
            {platformPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div key={pillar.title} className="rounded-2xl border border-border bg-panel/70 p-4">
                  <Icon className="h-5 w-5 text-accent-2" />
                  <h3 className="mt-4 text-sm font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{pillar.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Identity", "Company profile, domain, brand, currency, region."],
          ["Access", "Roles, SSO, 2FA, client portal boundaries."],
          ["Data", "Projects, people, files, finance, knowledge import."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[24px] border border-border bg-surface/62 p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-positive/12 text-positive">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
