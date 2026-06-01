"use client";

import { Bot, BrainCircuit, FileText, Gauge, MessageSquareText, Play, Search, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { aiAgents } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function IntelligenceModule() {
  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <Badge tone="accent">NEXUS Mind</Badge>
          <h2 className="mt-4 text-3xl font-semibold">AI-native operating layer</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Streaming assistant, autonomous agents, semantic search, proposal generation,
            design insights, multi-model routing, and monthly cost governance.
          </p>
        </div>
        <Button variant="primary">
          <Settings2 className="h-4 w-4" />
          Configure router
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [Gauge, "Monthly AI spend", formatCurrency(9420)],
          [BrainCircuit, "Indexed chunks", "24,180"],
          [MessageSquareText, "Assistant chats", "1,284"],
          [FileText, "Reports drafted", "96"],
        ].map(([Icon, label, value]) => (
          <Card key={String(label)}>
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
            <p className="mt-3 text-2xl font-semibold">{String(value)}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Autonomous agents" eyebrow="Scheduled and trigger based" />
          <div className="grid gap-3 md:grid-cols-2">
            {aiAgents.map((agent) => (
              <article key={agent.id} className="rounded-xl border border-border bg-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{agent.name}</p>
                    <p className="mt-1 text-xs text-muted">{agent.cadence}</p>
                  </div>
                  <Badge tone={agent.status === "Paused" ? "warning" : "accent"}>{agent.status}</Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{agent.signal}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span>Last run {agent.lastRun}</span>
                  <span>{formatCurrency(agent.spend)}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Ask your data" eyebrow="RAG search" />
          <div className="rounded-xl border border-border bg-panel p-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                placeholder="Which projects resemble this brief?"
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "Atlas HQ board minutes cite two unresolved facade assumptions.",
              "Nova Labs finish schedule has 12 approved FF&E substitutions.",
              "Meridian production package has a supplier risk in electrical load.",
            ].map((result) => (
              <div key={result} className="rounded-xl border border-border bg-panel p-4">
                <p className="text-sm leading-6 text-muted">{result}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [Bot, "Proposal generator", "Creates branded PDF proposals from brief, team, fee, timeline, and terms."],
          [Play, "Meeting scribe", "Transcribes calls, summarizes decisions, and creates task actions."],
          [BrainCircuit, "Design insights", "Analyzes plans, photos, palettes, and comparable built works."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)}>
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{String(title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{String(description)}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
