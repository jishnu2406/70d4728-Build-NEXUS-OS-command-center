"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  MapPin,
  Plus,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gate } from "@/components/gate";
import { projects } from "@/lib/data";
import { ProjectPhase } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

const phases: ProjectPhase[] = [
  "Concept",
  "Schematic",
  "Design Dev",
  "Documentation",
  "Construction",
  "Handover",
];

const projectViews = [
  { value: "kanban", label: "Kanban", icon: Rows3 },
  { value: "table", label: "Table", icon: FileText },
  { value: "calendar", label: "Calendar", icon: CalendarDays },
  { value: "map", label: "Map", icon: MapPin },
];

export function ProjectWorkspace() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <Badge tone="accent">Project Management</Badge>
          <h2 className="mt-4 text-3xl font-semibold">Design operations cockpit</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Kanban phases, Gantt assumptions, document vaults, RFIs, budgets, approvals,
            client communication, and AI risk detection are modeled around architecture,
            interiors, brand, and production workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Gate permission="projects:create">
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </Gate>
        </div>
      </section>

      <Tabs.Root defaultValue="kanban" className="space-y-4">
        <Tabs.List className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface/72 p-2">
          {projectViews.map(({ value, label, icon: Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted transition data-[state=active]:bg-panel data-[state=active]:text-text"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="kanban" className="outline-none">
          <div className="grid gap-3 overflow-x-auto pb-2 lg:grid-cols-6">
            {phases.map((phase) => (
              <div
                key={phase}
                className="min-h-[440px] min-w-[260px] rounded-xl border border-border bg-surface/62 p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{phase}</p>
                  <Badge>{projects.filter((project) => project.phase === phase).length}</Badge>
                </div>
                <div className="space-y-3">
                  {projects
                    .filter((project) => project.phase === phase)
                    .map((project, index) => (
                      <motion.article
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-xl border border-border bg-panel p-4 shadow-sm"
                      >
                        <div className="mb-4 h-24 rounded-lg border border-border bg-[linear-gradient(135deg,rgb(var(--accent-2)/0.25),transparent),linear-gradient(45deg,rgb(var(--accent)/0.12),rgb(var(--surface)))] p-3">
                          <p className="max-w-[14rem] text-xs leading-5 text-muted">
                            {project.cover}
                          </p>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{project.name}</p>
                            <p className="mt-1 text-xs text-muted">{project.client}</p>
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
                        <Progress value={project.completion} className="mt-4" />
                        <div className="mt-4 flex items-center justify-between text-xs text-muted">
                          <span>{formatPercent(project.completion)}</span>
                          <span>{project.dueInDays}d due</span>
                        </div>
                      </motion.article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="table" className="outline-none">
          <Card>
            <CardHeader title="Project register" eyebrow="Spreadsheet-like view" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.12em] text-muted">
                    {["Code", "Project", "Phase", "Lead", "Budget", "Spent", "Margin", "Risk"].map(
                      (column) => (
                        <th key={column} className="border-b border-border px-3 py-3">
                          {column}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="text-muted">
                      <td className="border-b border-border px-3 py-4 font-mono text-xs">
                        {project.code}
                      </td>
                      <td className="border-b border-border px-3 py-4 text-text">
                        {project.name}
                      </td>
                      <td className="border-b border-border px-3 py-4">{project.phase}</td>
                      <td className="border-b border-border px-3 py-4">{project.lead}</td>
                      <td className="border-b border-border px-3 py-4">
                        {formatCurrency(project.budget)}
                      </td>
                      <td className="border-b border-border px-3 py-4">
                        {formatCurrency(project.spent)}
                      </td>
                      <td className="border-b border-border px-3 py-4">{project.margin}%</td>
                      <td className="border-b border-border px-3 py-4">
                        <Badge
                          tone={
                            project.status === "Blocked"
                              ? "danger"
                              : project.status === "On Track"
                                ? "positive"
                                : "warning"
                          }
                        >
                          {project.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="calendar" className="outline-none">
          <div className="grid gap-4 lg:grid-cols-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CalendarDays className="mb-4 h-5 w-5 text-accent-2" />
                <p className="text-sm font-semibold">{project.name}</p>
                <p className="mt-2 text-sm text-muted">
                  Milestone gate in {project.dueInDays} days.
                </p>
              </Card>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="map" className="outline-none">
          <Card className="min-h-[480px]">
            <CardHeader title="Geo-located portfolio map" eyebrow="Mapbox-ready data" />
            <div className="relative h-[380px] overflow-hidden rounded-xl border border-border bg-[linear-gradient(135deg,rgb(var(--accent-2)/0.22),transparent),linear-gradient(45deg,rgb(var(--surface)),rgb(var(--panel)))]">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="absolute rounded-xl border border-border bg-surface/90 p-3 text-xs shadow-lift"
                  style={{
                    left: `${12 + index * 19}%`,
                    top: `${18 + (index % 2) * 38}%`,
                  }}
                >
                  <p className="font-semibold text-text">{project.location}</p>
                  <p className="mt-1 text-muted">{project.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["Brief analyzer", "Extract scope, missing assumptions, and client questions."],
          ["Budget estimator", "Compare live burn with historic project typologies."],
          ["Drawing reviewer", "Scan uploaded PDFs for missing notes and compliance flags."],
        ].map(([title, description]) => (
          <Card key={title}>
            <ClipboardCheck className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
