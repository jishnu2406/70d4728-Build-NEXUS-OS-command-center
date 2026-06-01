"use client";

import { Bot, Building2, Cable, FolderPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setupSteps } from "@/lib/data";

const icons = [Building2, Users, Bot, FolderPlus, Cable];

export function OnboardingModule() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-[28px] border border-border bg-surface/72 p-6 backdrop-blur-2xl md:p-8">
        <Badge tone="accent">First-run setup</Badge>
        <h2 className="mt-4 text-4xl font-semibold leading-tight">Launch a tenant workspace</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:text-base">
          This wizard is intentionally blank for each MNC. It captures identity, team,
          modules, imports, integrations, and launch rules from that company only.
        </p>
      </section>
      <div className="mt-5 grid gap-4">
        {setupSteps.map((step, index) => {
          const Icon = icons[index] ?? Building2;

          return (
            <Card key={step.id} className="flex items-center justify-between gap-4 rounded-[24px]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-panel">
                  <Icon className="h-5 w-5 text-accent-2" />
                </div>
                <div>
                  <p className="text-xs text-muted">Step {index + 1}</p>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.description}</p>
                </div>
              </div>
              <Button variant={index === 0 ? "primary" : "secondary"}>
                {index === 0 ? "Start" : "Prepare"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
