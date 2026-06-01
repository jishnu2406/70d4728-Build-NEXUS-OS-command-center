"use client";

import { Activity, Building2, Flag, Gauge, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Gate } from "@/components/gate";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceProgress,
  workspaceTeamCount,
} from "@/stores/workspace-store";

export function AdminModule() {
  const profile = useWorkspaceStore((state) => state.profile);
  const team = useWorkspaceStore((state) => state.team);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const workspaceName = workspaceDisplayName(profile);
  const progress = workspaceProgress(completedSteps);
  const tenantCreated = Boolean(profile.companyName || completedSteps.length);
  const teamCount = workspaceTeamCount(team);

  return (
    <Gate
      permission="admin:view"
      fallback={
        <Card>
          <h2 className="text-xl font-semibold">Super admin access restricted</h2>
          <p className="mt-2 text-sm text-muted">Only platform owners and CEO-level roles can view this route.</p>
        </Card>
      }
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
        <EmptyState
          icon={ShieldCheck}
          eyebrow="Super admin"
          title={tenantCreated ? `${workspaceName} tenant is registered.` : "Platform control starts empty."}
          description={
            tenantCreated
              ? `Setup progress is ${progress}%. Region: ${profile.region || "Not selected"}. Type: ${profile.companyType || "Not selected"}.`
              : "Add MNC tenants only when each company is ready. This console has no preset organizations, users, revenue, or health scores."
          }
          action="Create tenant"
          actionHref="/onboarding?step=tenant"
          secondary={
            <Button asChild variant="glass">
              <Link href="/onboarding?step=feature-flags">
                <Flag className="h-4 w-4" />
                Feature flags
              </Link>
            </Button>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          {[
            [Building2, "Organizations", "0"],
            [Users, "Users", "0"],
            [Gauge, "MRR", "$0"],
            [Activity, "P95 latency", "Live after deploy"],
          ].map(([Icon, label, value]) => {
            const displayValue =
              label === "Organizations" ? (tenantCreated ? "1" : "0") : label === "Users" ? String(teamCount) : value;

            return (
            <Card key={String(label)} className="rounded-[24px]">
              <Icon className="mb-4 h-5 w-5 text-accent-2" />
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
              <p className="mt-3 text-2xl font-semibold">{String(displayValue)}</p>
            </Card>
            );
          })}
        </section>

        <Card className="rounded-[24px]">
          <CardHeader title="Organization health" eyebrow={tenantCreated ? "Tenant active" : "No tenants yet"} />
          <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
            {tenantCreated
              ? `${workspaceName} is now visible to the platform console. Complete setup to move it to live.`
              : "Tenant records appear here after organizations are created or imported."}
          </div>
        </Card>
      </div>
    </Gate>
  );
}
