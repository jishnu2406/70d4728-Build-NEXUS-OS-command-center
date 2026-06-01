"use client";

import { CheckCircle2, CreditCard, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useWorkspaceStore, workspaceDisplayName } from "@/stores/workspace-store";

export function ClientPortalModule() {
  const profile = useWorkspaceStore((state) => state.profile);
  const enabledModules = useWorkspaceStore((state) => state.enabledModules);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const workspaceName = workspaceDisplayName(profile);
  const portalReady = enabledModules.includes("Client portal") || completedSteps.includes("modules");

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={ShieldCheck}
        eyebrow="Client portal"
        title={
          portalReady
            ? `${workspaceName} client portal is ready to configure.`
            : "No clients are visible until this MNC creates its first portal."
        }
        description={
          portalReady
            ? "Add clients, project visibility, approval milestones, shared documents, payment links, and access rules from this tenant's real workspace."
            : "Each tenant gets a blank, white-labeled portal. Add clients, projects, approval milestones, shared documents, payment links, and access rules during setup."
        }
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
        <CardHeader title="Portal activity" eyebrow={portalReady ? "Ready" : "Empty"} />
        <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
          {portalReady
            ? `Portal shell is ready for ${workspaceName}. Activity appears after client users are invited.`
            : "Client approvals, comments, document access, and payments will appear here after launch."}
        </div>
      </Card>
    </div>
  );
}
