"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CalendarDays, FileText, FolderKanban, MapPin, Plus, Rows3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectPhase } from "@/lib/types";
import { useWorkspaceStore, workspaceDisplayName } from "@/stores/workspace-store";

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
  const profile = useWorkspaceStore((state) => state.profile);
  const imports = useWorkspaceStore((state) => state.imports);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const workspaceName = workspaceDisplayName(profile);
  const hasProjectPlan = Boolean(imports.projectSource || completedSteps.includes("data"));

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
        action="Create first project"
        actionHref="/onboarding?step=first-project"
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-data">
              <Plus className="h-4 w-4" />
              Import project register
            </Link>
          </Button>
        }
      />

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
            {phases.map((phase) => (
              <div
                key={phase}
                className="min-h-[320px] rounded-2xl border border-border bg-surface/62 p-3 backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{phase}</p>
                  <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                    {phase === "Concept" && hasProjectPlan ? 1 : 0}
                  </span>
                </div>
                <div className="flex h-[245px] items-center justify-center rounded-2xl border border-dashed border-border bg-panel/40 p-5 text-center text-sm leading-6 text-muted">
                  {phase === "Concept" && hasProjectPlan
                    ? `Project intake prepared from ${imports.projectSource || "manual setup"}.`
                    : "Drop future projects here after setup."}
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="table">
          <Card>
            <CardHeader title="Project register" eyebrow="Empty" />
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
              No project rows yet. Import a register or create a project from the setup wizard.
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="calendar">
          <Card>
            <CardHeader title="Milestone calendar" eyebrow="Empty" />
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
              Milestones will appear after the first project phase plan is created.
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="map">
          <Card>
            <CardHeader title="Portfolio map" eyebrow="Empty" />
            <div className="h-[360px] rounded-2xl border border-dashed border-border bg-[linear-gradient(135deg,rgb(var(--accent-2)/0.12),transparent),rgb(var(--panel)/0.5)] p-10 text-center text-sm text-muted">
              Add project locations to activate the map.
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
