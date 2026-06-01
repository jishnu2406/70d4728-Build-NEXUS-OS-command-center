"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CloudSun,
  Grip,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  aiAgents,
  dashboardStats,
  organization,
  projects,
  team,
} from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

const RevenuePipelineChart = dynamic(
  () => import("@/components/dashboard/charts").then((mod) => mod.RevenuePipelineChart),
  { ssr: false, loading: () => <div className="skeleton h-full rounded-xl" /> },
);

const UtilizationChart = dynamic(
  () => import("@/components/dashboard/charts").then((mod) => mod.UtilizationChart),
  { ssr: false, loading: () => <div className="skeleton h-full rounded-xl" /> },
);

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const executiveSignals = [
  {
    label: "Upcoming deadline",
    title: "Meridian supplier sign-off",
    value: "5 days",
    icon: CalendarClock,
  },
  {
    label: "Client satisfaction",
    title: "Average portfolio score",
    value: "91/100",
    icon: Sparkles,
  },
  {
    label: "Revenue at risk",
    title: "Blocked milestones",
    value: formatCurrency(740000),
    icon: ArrowUpRight,
  },
];

export function CommandCenter() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
      <section className="grid gap-4 2xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden p-0">
          <div className="grid min-h-[330px] gap-0 2xl:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 md:p-8">
              <Badge tone="accent">Command. Create. Conquer.</Badge>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl 2xl:text-5xl">
                Enterprise command center for design-led MNC operations.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted md:text-base">
                Multi-tenant project control, AI agents, financial forecasting,
                client portals, and knowledge search are stitched into one workspace.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {dashboardStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    {...cardMotion}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-border bg-panel/75 p-4"
                  >
                    <p className="text-xs text-muted">{stat.label}</p>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <span
                        className={
                          stat.tone === "positive"
                            ? "text-xs text-positive"
                            : "text-xs text-warning"
                        }
                      >
                        {stat.delta}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] border-t border-border bg-panel/50 p-6 lg:border-l lg:border-t-0">
              <div className="absolute inset-6 rounded-[22px] border border-border bg-[linear-gradient(135deg,rgb(var(--accent-2)/0.18),transparent_58%),linear-gradient(45deg,rgb(var(--accent)/0.08),transparent)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Badge>Org health {organization.health}%</Badge>
                  <Grip className="h-4 w-4 text-muted" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    Live operating graph
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["Projects", "People", "Capital"].map((node, index) => (
                      <motion.div
                        key={node}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + index * 0.08 }}
                        className="rounded-2xl border border-border bg-surface/80 p-4 text-center"
                      >
                        <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-accent-2/40 bg-accent-2/16" />
                        <p className="text-xs font-medium text-muted">{node}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-surface/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-accent-2" />
                    AI executive brief
                  </div>
                  <p className="text-sm leading-6 text-muted">
                    Two projects require intervention; current AI automation is
                    projected to save 184 hours this week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="48-hour alert board"
            eyebrow="Overdue Items"
            action={<Badge tone="danger">4 flags</Badge>}
          />
          <div className="space-y-3">
            {projects
              .filter((project) => project.status !== "On Track")
              .map((project) => (
                <div key={project.id} className="rounded-xl border border-border bg-panel p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="mt-1 text-sm leading-5 text-muted">{project.risk}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr_0.8fr]">
        <Card className="min-h-[360px]">
          <CardHeader
            title="Revenue pipeline"
            eyebrow="Forecast"
            action={<Button variant="ghost" size="sm">Export</Button>}
          />
          <div className="h-[260px]">
            <RevenuePipelineChart />
          </div>
        </Card>

        <Card>
          <CardHeader title="Team utilization" eyebrow="Capacity" />
          <div className="h-[260px]">
            <UtilizationChart />
          </div>
        </Card>

        <Card>
          <CardHeader title="AI activity feed" eyebrow="NEXUS Mind" />
          <div className="space-y-3">
            {aiAgents.slice(0, 3).map((agent) => (
              <div key={agent.id} className="rounded-xl border border-border bg-panel p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{agent.name}</p>
                  <Badge tone={agent.status === "Paused" ? "warning" : "accent"}>
                    {agent.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-5 text-muted">{agent.signal}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader title="Active project heatmap" eyebrow="Status x Deadline" />
          <div className="grid gap-3 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                {...cardMotion}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-panel p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{project.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {project.code} / {project.phase} / {project.lead}
                    </p>
                  </div>
                  <Badge
                    tone={
                      project.status === "On Track"
                        ? "positive"
                        : project.status === "Blocked"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <Progress
                  value={project.completion}
                  tone={project.status === "Blocked" ? "danger" : "accent"}
                  className="mt-4"
                />
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span>{formatPercent(project.completion)} complete</span>
                  <span>{project.dueInDays} days left</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Resource calendar" eyebrow="Today" />
          <div className="space-y-3">
            {team.map((person) => (
              <div key={person.id} className="rounded-xl border border-border bg-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-muted">{person.department}</p>
                  </div>
                  <Badge tone={person.utilization > 90 ? "danger" : "neutral"}>
                    {person.utilization}%
                  </Badge>
                </div>
                <Progress
                  value={person.utilization}
                  tone={person.utilization > 90 ? "danger" : "positive"}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border bg-panel p-4">
            <div className="mb-2 flex items-center gap-2">
              <CloudSun className="h-4 w-4 text-warning" />
              <p className="text-sm font-medium">Field weather</p>
            </div>
            <p className="text-sm text-muted">
              Dubai site visit window is clear until 16:00. Heat protocol recommended.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {executiveSignals.map(({ label, title, value, icon: Icon }) => (
          <Card key={label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
              <p className="mt-2 text-sm text-muted">{title}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
            <Icon className="h-8 w-8 text-accent-2" />
          </Card>
        ))}
      </section>
    </div>
  );
}
