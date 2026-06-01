"use client";

import { useMemo, useState } from "react";
import { Bot, Building2, Cable, Check, FolderPlus, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { setupSteps } from "@/lib/data";

const icons = [Building2, Users, Bot, FolderPlus, Cable];

const stepDetails = [
  {
    fields: ["Company name", "Company type", "Primary region", "Currency", "Brand color"],
    outcome: "Creates the tenant identity, display name, slug, and default locale.",
  },
  {
    fields: ["CEO / owner", "Directors", "Finance admins", "Project leads", "Client users"],
    outcome: "Sets role hierarchy, permissions, and invitation batches.",
  },
  {
    fields: ["Project modules", "Finance module", "Client portal", "AI layer", "Super admin"],
    outcome: "Enables only the modules this MNC wants at launch.",
  },
  {
    fields: ["Project register", "People CSV", "Asset folders", "Invoices", "Knowledge base"],
    outcome: "Prepares clean imports without adding sample records.",
  },
  {
    fields: ["SSO", "2FA policy", "Billing", "AI budgets", "Launch review"],
    outcome: "Locks launch settings before the workspace goes live.",
  },
];

export function OnboardingModule() {
  const [activeStep, setActiveStep] = useState(0);
  const [preparedSteps, setPreparedSteps] = useState<number[]>([]);

  const progress = Math.round((preparedSteps.length / setupSteps.length) * 100);
  const detail = stepDetails[activeStep];
  const ActiveIcon = icons[activeStep] ?? Building2;

  const selectedStep = useMemo(() => setupSteps[activeStep], [activeStep]);

  function togglePrepared(index: number) {
    setPreparedSteps((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="rounded-[28px] border border-border bg-surface/72 p-6 backdrop-blur-2xl md:p-8">
        <Badge tone="accent">First-run setup</Badge>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <h2 className="text-4xl font-semibold leading-tight">Launch a tenant workspace</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:text-base">
              This wizard is intentionally blank for each MNC. Select a step, prepare
              the required information, then launch with only real tenant data.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-panel/70 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Setup progress</span>
              <span className="text-muted">{progress}%</span>
            </div>
            <Progress value={progress} tone={progress === 100 ? "positive" : "accent"} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_390px]">
        <div className="grid gap-4">
          {setupSteps.map((step, index) => {
            const Icon = icons[index] ?? Building2;
            const prepared = preparedSteps.includes(index);
            const active = activeStep === index;

            return (
              <Card
                key={step.id}
                className={cn(
                  "grid gap-4 rounded-[24px] p-5",
                  active && "border-accent-2/50 bg-accent-2/10",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className="focus-ring grid grid-cols-[auto_1fr] items-start gap-4 rounded-2xl text-left"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-panel",
                      active && "border-accent-2/40 bg-accent-2/12",
                    )}
                  >
                    {prepared ? (
                      <Check className="h-5 w-5 text-positive" />
                    ) : (
                      <Icon className="h-5 w-5 text-accent-2" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-accent-2">Step {index + 1}</p>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
                  </div>
                </button>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant={active ? "primary" : "secondary"}
                    onClick={() => setActiveStep(index)}
                  >
                    {index === 0 ? "Start" : "Open"}
                  </Button>
                  <Button
                    type="button"
                    variant={prepared ? "subtle" : "outline"}
                    onClick={() => togglePrepared(index)}
                  >
                    {prepared ? "Prepared" : "Prepare"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <aside className="panel sticky top-20 h-fit rounded-[24px] p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-2/12 text-accent-2">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Active step</p>
              <h3 className="mt-1 text-lg font-semibold">{selectedStep.title}</h3>
            </div>
          </div>

          <div className="space-y-3">
            {detail.fields.map((field) => (
              <label
                key={field}
                className="flex items-center gap-3 rounded-2xl border border-border bg-panel/70 p-3 text-sm"
              >
                <input type="checkbox" className="h-4 w-4 accent-current" />
                <span>{field}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-accent-2" />
              Outcome
            </div>
            <p className="text-sm leading-6 text-muted">{detail.outcome}</p>
          </div>

          <Button
            type="button"
            className="mt-5 w-full"
            variant={preparedSteps.includes(activeStep) ? "subtle" : "primary"}
            onClick={() => togglePrepared(activeStep)}
          >
            {preparedSteps.includes(activeStep) ? "Step prepared" : "Mark step prepared"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
