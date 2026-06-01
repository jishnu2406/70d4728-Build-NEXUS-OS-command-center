"use client";

import { Bot, Building2, Cable, FolderPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  { icon: Building2, title: "Org Identity", text: "Name, type, logo, brand color, and domain." },
  { icon: Users, title: "Team Setup", text: "Invite members and assign role hierarchy." },
  { icon: Bot, title: "Configure AI", text: "Choose persona, budget, model router, and seed docs." },
  { icon: FolderPlus, title: "First Project", text: "Create a real starter project from templates." },
  { icon: Cable, title: "Connect Tools", text: "Slack, Drive, Calendar, Figma, accounting, and CAD." },
];

export function OnboardingModule() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-2xl border border-border bg-surface/72 p-6 backdrop-blur-xl">
        <Badge tone="accent">First-run setup</Badge>
        <h2 className="mt-4 text-3xl font-semibold">Launch a tenant workspace</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          The AI-guided setup wizard gets a design organization from blank account to
          configured operating workspace in five steps.
        </p>
      </section>
      <div className="mt-5 grid gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card key={step.title} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-panel">
                  <Icon className="h-5 w-5 text-accent-2" />
                </div>
                <div>
                  <p className="text-xs text-muted">Step {index + 1}</p>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </div>
              <Button variant={index === 0 ? "primary" : "secondary"}>
                {index === 0 ? "Start" : "Configure"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
