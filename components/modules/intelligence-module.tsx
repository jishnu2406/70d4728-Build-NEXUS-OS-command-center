"use client";

import { Bot, BrainCircuit, FileText, Gauge, MessageSquareText, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function IntelligenceModule() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={BrainCircuit}
        eyebrow="NEXUS Mind"
        title="AI is off until this MNC configures its own keys and rules."
        description="No preset prompts, documents, agents, or historical context are shipped. Connect model providers, budgets, data sources, and compliance rules per tenant."
        action="Configure AI"
        secondary={
          <Button variant="glass">
            <Settings2 className="h-4 w-4" />
            Model router
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [Gauge, "AI spend", "$0"],
          [BrainCircuit, "Indexed chunks", "0"],
          [MessageSquareText, "Conversations", "0"],
          [FileText, "Reports drafted", "0"],
        ].map(([Icon, label, value]) => (
          <Card key={String(label)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
            <p className="mt-3 text-3xl font-semibold">{String(value)}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[24px]">
          <CardHeader title="Autonomous agents" eyebrow="Not configured" />
          <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
            Agents appear here after the tenant defines schedules, triggers, permissions, and budgets.
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
