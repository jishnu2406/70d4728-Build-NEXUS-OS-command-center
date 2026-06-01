"use client";

import { CheckCircle2, CreditCard, FileText, MessageSquare, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function ClientPortalModule() {
  const project = projects[1];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface/72 backdrop-blur-xl">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-8">
            <Badge tone="accent">White-labeled portal</Badge>
            <h2 className="mt-4 text-3xl font-semibold">{project.client}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Client-friendly progress, milestone approval, watermarked document sharing,
              payment links, comments, and meeting scheduling in the firm’s brand system.
            </p>
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm text-muted">
                <span>{project.name}</span>
                <span>{project.completion}% complete</span>
              </div>
              <Progress value={project.completion} tone="positive" />
            </div>
          </div>
          <div className="border-t border-border bg-panel/50 p-6 lg:border-l lg:border-t-0">
            <div className="rounded-xl border border-border bg-surface/80 p-5">
              <p className="text-sm font-semibold">Next approval</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Sign off the revised millwork package and lighting addendum by Friday.
              </p>
              <Button className="mt-5 w-full" variant="primary">
                <PenLine className="h-4 w-4" />
                Review milestone
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [CheckCircle2, "Milestones", "8 of 11 approved"],
          [FileText, "Shared documents", "24 files"],
          [CreditCard, "Open invoice", formatCurrency(185000)],
          [MessageSquare, "Feedback threads", "6 active"],
        ].map(([Icon, label, value]) => (
          <Card key={String(label)}>
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
            <p className="mt-3 text-xl font-semibold">{String(value)}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Portal activity" eyebrow="Client-visible" />
        <div className="space-y-3">
          {[
            "Nova approved furniture mockup set B.",
            "Foster + Partners shared the lighting coordination markups.",
            "Client requested a Tuesday design review with procurement team.",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-border bg-panel p-4 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
