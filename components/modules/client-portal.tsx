"use client";

import { CheckCircle2, CreditCard, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function ClientPortalModule() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={ShieldCheck}
        eyebrow="Client portal"
        title="No clients are visible until this MNC creates its first portal."
        description="Each tenant gets a blank, white-labeled portal. Add clients, projects, approval milestones, shared documents, payment links, and access rules during setup."
        action="Create client portal"
        actionHref="/onboarding?step=client-portal"
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [CheckCircle2, "Milestones", "0"],
          [FileText, "Shared documents", "0"],
          [CreditCard, "Open invoices", "$0"],
          [MessageSquare, "Feedback threads", "0"],
        ].map(([Icon, label, value]) => (
          <Card key={String(label)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
            <p className="mt-3 text-2xl font-semibold">{String(value)}</p>
          </Card>
        ))}
      </section>

      <Card className="rounded-[24px]">
        <CardHeader title="Portal activity" eyebrow="Empty" />
        <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
          Client approvals, comments, document access, and payments will appear here after launch.
        </div>
      </Card>
    </div>
  );
}
