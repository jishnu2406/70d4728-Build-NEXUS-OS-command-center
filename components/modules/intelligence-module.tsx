"use client";

import { Bot, BrainCircuit, FileText, Gauge, MessageSquareText, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useWorkspaceStore, workspaceDisplayName } from "@/stores/workspace-store";

export function IntelligenceModule() {
  const profile = useWorkspaceStore((state) => state.profile);
  const enabledModules = useWorkspaceStore((state) => state.enabledModules);
  const imports = useWorkspaceStore((state) => state.imports);
  const launch = useWorkspaceStore((state) => state.launch);
  const workspaceName = workspaceDisplayName(profile);
  const aiEnabled = enabledModules.includes("AI layer") || Boolean(launch.aiBudget);
  const aiCards = [
    [Gauge, "AI spend", `${profile.currency || "$"}0`],
    [BrainCircuit, "Indexed chunks", imports.knowledgeSource ? "Ready" : "0"],
    [MessageSquareText, "Conversations", "0"],
    [FileText, "Reports drafted", "0"],
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={BrainCircuit}
        eyebrow="NEXUS Mind"
        title={
          aiEnabled
            ? `NEXUS Mind is prepared for ${workspaceName}.`
            : "AI is off until this MNC configures its own keys and rules."
        }
        description={
          aiEnabled
            ? `Budget: ${launch.aiBudget || "Not capped yet"}. Knowledge source: ${imports.knowledgeSource || "Not linked yet"}. Tenant memory starts only from this MNC's data.`
            : "No preset prompts, documents, agents, or historical context are shipped. Connect model providers, budgets, data sources, and compliance rules per tenant."
        }
        action="Configure AI"
        actionHref="/onboarding?step=ai"
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=model-router">
              <Settings2 className="h-4 w-4" />
              Model router
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {aiCards.map(([Icon, label, value]) => (
          <Card key={String(label)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
            <p className="mt-3 text-3xl font-semibold">{String(value)}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[24px]">
          <CardHeader title="Autonomous agents" eyebrow={aiEnabled ? "Prepared" : "Not configured"} />
          <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
            {aiEnabled
              ? `Ready to create agents under ${workspaceName}'s permissions.`
              : "Agents appear here after the tenant defines schedules, triggers, permissions, and budgets."}
          </div>
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader title="Ask your data" eyebrow="No index yet" />
          <div className="rounded-2xl border border-border bg-panel/70 p-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                disabled
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
                placeholder="Import documents to activate search"
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [Bot, "Assistant", "Starts with no tenant memory until data is connected."],
          [FileText, "Proposal generator", "Uses this MNC’s brand kit after setup."],
          [BrainCircuit, "Design insights", "Requires uploaded plans, images, and standards."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{String(title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{String(description)}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
