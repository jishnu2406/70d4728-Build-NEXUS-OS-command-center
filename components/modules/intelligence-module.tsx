"use client";

import { useState } from "react";
import { Bot, BrainCircuit, FileText, Gauge, MessageSquareText, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
} from "@/stores/workspace-store";

function parseAmount(value: string) {
  return Number(value.replace(/[^\d.-]/g, "")) || 0;
}

function formatCurrency(value: number, currency: string) {
  if (/^[A-Z]{3}$/.test(currency)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return `${currency || "$"}${value.toLocaleString("en-US")}`;
}

export function IntelligenceModule() {
  const [agentForm, setAgentForm] = useState({
    name: "",
    purpose: "",
    budget: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const enabledModules = useWorkspaceStore((state) => state.enabledModules);
  const imports = useWorkspaceStore((state) => state.imports);
  const launch = useWorkspaceStore((state) => state.launch);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const aiAgents = useWorkspaceStore((state) => state.aiAgents);
  const addAiAgent = useWorkspaceStore((state) => state.addAiAgent);
  const workspaceName = workspaceDisplayName(profile);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const aiEnabled = enabledModules.includes("AI layer") || Boolean(launch.aiBudget || aiAgents.length);
  const currency = profile.currency || "$";
  const agentBudget = aiAgents.reduce((sum, agent) => sum + parseAmount(agent.budget), 0);
  const aiCards = [
    [Gauge, "AI budget", formatCurrency(agentBudget, currency)],
    [BrainCircuit, "Indexed chunks", imports.knowledgeSource ? "Ready" : "0"],
    [MessageSquareText, "Conversations", "0"],
    [FileText, "Agents", String(aiAgents.length)],
  ];

  function updateAgentForm(key: keyof typeof agentForm, value: string) {
    setAgentForm((current) => ({ ...current, [key]: value }));
  }

  function createAgent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !agentForm.name.trim()) {
      return;
    }

    addAiAgent({
      name: agentForm.name.trim(),
      purpose: agentForm.purpose.trim(),
      budget: agentForm.budget.trim(),
    });
    setAgentForm({
      name: "",
      purpose: "",
      budget: "",
    });
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={BrainCircuit}
        eyebrow="NEXUS Mind"
        title={
          aiEnabled || isLive
            ? `NEXUS Mind is prepared for ${workspaceName}.`
            : "AI is off until this MNC configures its own keys and rules."
        }
        description={
          isLive
            ? "Create tenant-specific AI agents, budgets, model routing, data access, and compliance rules. Nothing carries over from another company."
            : aiEnabled
            ? `Budget: ${launch.aiBudget || "Not capped yet"}. Knowledge source: ${imports.knowledgeSource || "Not linked yet"}. Tenant memory starts only from this MNC's data.`
            : "No preset prompts, documents, agents, or historical context are shipped. Connect model providers, budgets, data sources, and compliance rules per tenant."
        }
        action="Configure AI"
        actionHref={isLive ? "#add-ai-agent" : "/onboarding?step=ai"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=model-router">
              <Settings2 className="h-4 w-4" />
              Model router
            </Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-ai-agent" className="rounded-[24px]">
          <CardHeader title="Add AI agent" eyebrow="Tenant intelligence" />
          <form onSubmit={createAgent} className="grid gap-3 md:grid-cols-[1fr_1.2fr_0.7fr]">
            <input
              value={agentForm.name}
              onChange={(event) => updateAgentForm("name", event.target.value)}
              placeholder="Agent name"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              value={agentForm.purpose}
              onChange={(event) => updateAgentForm("purpose", event.target.value)}
              placeholder="Agent purpose"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              inputMode="decimal"
              value={agentForm.budget}
              onChange={(event) => updateAgentForm("budget", event.target.value)}
              placeholder={`Budget (${currency})`}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="md:col-span-3">
              <Bot className="h-4 w-4" />
              Add AI agent
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <CardHeader title="Launch required" eyebrow="AI locked" />
          <p className="text-sm leading-6 text-muted">
            Launch the MNC workspace before creating tenant agents, prompts, schedules, or model budgets.
          </p>
        </Card>
      )}

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
          <CardHeader title="Autonomous agents" eyebrow={aiAgents.length ? "Live agents" : aiEnabled ? "Prepared" : "Not configured"} />
          {aiAgents.length ? (
            <div className="grid gap-3">
              {aiAgents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-border bg-panel/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{agent.name}</p>
                      <p className="mt-1 text-sm text-muted">{agent.purpose || "Purpose pending"}</p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                      {agent.budget ? formatCurrency(parseAmount(agent.budget), currency) : "Budget pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
              {aiEnabled
                ? `Ready to create agents under ${workspaceName}'s permissions.`
                : "Agents appear here after the tenant defines schedules, triggers, permissions, and budgets."}
            </div>
          )}
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader title="Ask your data" eyebrow={imports.knowledgeSource ? "Knowledge source ready" : "No index yet"} />
          <div className="rounded-2xl border border-border bg-panel/70 p-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                disabled={!imports.knowledgeSource}
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
                placeholder={imports.knowledgeSource ? "Search connected company knowledge" : "Import documents to activate search"}
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [Bot, "Assistant", "Starts with no tenant memory until data is connected."],
          [FileText, "Proposal generator", "Uses this MNC's brand kit after setup."],
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
