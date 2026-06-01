"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { CalendarDays, FileText, FolderKanban, MapPin, Plus, Rows3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectPhase } from "@/lib/types";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
} from "@/stores/workspace-store";

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
  const [projectForm, setProjectForm] = useState({
    name: "",
    phase: "Concept",
    client: "",
    location: "",
    budget: "",
    startDate: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const imports = useWorkspaceStore((state) => state.imports);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const projects = useWorkspaceStore((state) => state.projects);
  const addProject = useWorkspaceStore((state) => state.addProject);
  const workspaceName = workspaceDisplayName(profile);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const hasProjectPlan = Boolean(imports.projectSource || completedSteps.includes("data") || projects.length);

  function updateProjectForm(key: keyof typeof projectForm, value: string) {
    setProjectForm((current) => ({ ...current, [key]: value }));
  }

  function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !projectForm.name.trim()) {
      return;
    }

    addProject({
      name: projectForm.name.trim(),
      phase: projectForm.phase,
      client: projectForm.client.trim(),
      location: projectForm.location.trim(),
      budget: projectForm.budget.trim(),
      startDate: projectForm.startDate,
    });
    setProjectForm({
      name: "",
      phase: "Concept",
      client: "",
      location: "",
      budget: "",
      startDate: "",
    });
  }

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
      <EmptyState
        icon={FolderKanban}
        eyebrow="Projects"
        title={
          hasProjectPlan
            ? `${workspaceName} project workspace is ready for intake.`
            : "Create the first project structure for this MNC."
        }
        description={
          hasProjectPlan
            ? `Project source: ${imports.projectSource || "Manual setup"}. Add project types, phases, approval gates, client visibility, budgets, and templates that match this company.`
            : "Start clean with no imported demo work. Add project types, phases, approval gates, client visibility, budgets, and templates that match this company."
        }
        action={isLive ? "Add project below" : "Create first project"}
        actionHref={isLive ? "#add-project" : "/onboarding?step=first-project"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-data">
              <Plus className="h-4 w-4" />
              Import project register
            </Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-project" className="rounded-[24px]">
          <CardHeader title="Add project" eyebrow="Live workspace" />
          <form onSubmit={createProject} className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <input
              value={projectForm.name}
              onChange={(event) => updateProjectForm("name", event.target.value)}
              placeholder="Project name"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <select
              value={projectForm.phase}
              onChange={(event) => updateProjectForm("phase", event.target.value)}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            >
              {phases.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
            <input
              value={projectForm.client}
              onChange={(event) => updateProjectForm("client", event.target.value)}
              placeholder="Client"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={projectForm.location}
              onChange={(event) => updateProjectForm("location", event.target.value)}
              placeholder="Location"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={projectForm.budget}
              onChange={(event) => updateProjectForm("budget", event.target.value)}
              placeholder={`Budget (${profile.currency || "currency"})`}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              type="date"
              value={projectForm.startDate}
              onChange={(event) => updateProjectForm("startDate", event.target.value)}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="lg:col-span-3">
              <Plus className="h-4 w-4" />
              Add project to workspace
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <CardHeader title="Launch required" eyebrow="Projects locked" />
          <p className="text-sm leading-6 text-muted">
            Complete onboarding and launch the MNC workspace before adding live projects.
          </p>
        </Card>
      )}

      <Tabs.Root defaultValue="kanban" className="space-y-4">
        <Tabs.List className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface/72 p-2 backdrop-blur-xl">
          {projectViews.map(({ value, label, icon: Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-muted transition data-[state=active]:bg-panel data-[state=active]:text-text"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="kanban">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {phases.map((phase) => {
              const phaseProjects = projects.filter((project) => project.phase === phase);
              const showIntake = phase === "Concept" && hasProjectPlan && !phaseProjects.length;

              return (
                <div
                  key={phase}
                  className="min-h-[320px] rounded-2xl border border-border bg-surface/62 p-3 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{phase}</p>
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                      {phaseProjects.length + (showIntake ? 1 : 0)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {phaseProjects.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-border bg-panel/70 p-3">
                        <p className="text-sm font-semibold">{project.name}</p>
                        <p className="mt-1 text-xs text-muted">{project.client || "Internal project"}</p>
                        <p className="mt-3 text-xs text-muted">{project.location || "Location pending"}</p>
                      </div>
                    ))}
                    {showIntake ? (
                      <div className="rounded-2xl border border-dashed border-border bg-panel/40 p-5 text-center text-sm leading-6 text-muted">
                        Project intake prepared from {imports.projectSource || "manual setup"}.
                      </div>
                    ) : null}
                    {!phaseProjects.length && !showIntake ? (
                      <div className="flex h-[245px] items-center justify-center rounded-2xl border border-dashed border-border bg-panel/40 p-5 text-center text-sm leading-6 text-muted">
                        Drop future projects here after setup.
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Content>

        <Tabs.Content value="table">
          <Card>
            <CardHeader title="Project register" eyebrow={projects.length ? "Live records" : "Empty"} />
            {projects.length ? (
              <div className="grid gap-2">
                {projects.map((project) => (
                  <div key={project.id} className="grid gap-2 rounded-2xl border border-border bg-panel/60 p-4 text-sm md:grid-cols-5">
                    <span className="font-semibold">{project.name}</span>
                    <span>{project.phase}</span>
                    <span>{project.client || "No client"}</span>
                    <span>{project.location || "No location"}</span>
                    <span>{project.budget || "No budget"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
                No project rows yet. Import a register or create a project from the setup wizard.
              </div>
            )}
          </Card>
        </Tabs.Content>

        <Tabs.Content value="calendar">
          <Card>
            <CardHeader title="Milestone calendar" eyebrow={projects.length ? "Project starts" : "Empty"} />
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
              {projects.some((project) => project.startDate)
                ? projects
                    .filter((project) => project.startDate)
                    .map((project) => `${project.name}: ${project.startDate}`)
                    .join(" | ")
                : "Milestones will appear after the first project phase plan is created."}
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="map">
          <Card>
            <CardHeader title="Portfolio map" eyebrow="Empty" />
            <div className="h-[360px] rounded-2xl border border-dashed border-border bg-[linear-gradient(135deg,rgb(var(--accent-2)/0.12),transparent),rgb(var(--panel)/0.5)] p-10 text-center text-sm text-muted">
              {projects.some((project) => project.location)
                ? projects
                    .filter((project) => project.location)
                    .map((project) => `${project.name}: ${project.location}`)
                    .join(" | ")
                : "Add project locations to activate the map."}
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
