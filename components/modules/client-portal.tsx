"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, FileText, MessageSquare, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
} from "@/stores/workspace-store";

export function ClientPortalModule() {
  const [clientForm, setClientForm] = useState({
    name: "",
    contact: "",
    email: "",
    project: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const enabledModules = useWorkspaceStore((state) => state.enabledModules);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const clients = useWorkspaceStore((state) => state.clients);
  const invoices = useWorkspaceStore((state) => state.invoices);
  const addClient = useWorkspaceStore((state) => state.addClient);
  const workspaceName = workspaceDisplayName(profile);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const portalReady = enabledModules.includes("Client portal") || completedSteps.includes("modules") || clients.length > 0;

  function updateClientForm(key: keyof typeof clientForm, value: string) {
    setClientForm((current) => ({ ...current, [key]: value }));
  }

  function createClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !clientForm.name.trim()) {
      return;
    }

    addClient({
      name: clientForm.name.trim(),
      contact: clientForm.contact.trim(),
      email: clientForm.email.trim(),
      project: clientForm.project.trim(),
    });
    setClientForm({
      name: "",
      contact: "",
      email: "",
      project: "",
    });
  }

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
        action={isLive ? "Add client below" : "Create client portal"}
        actionHref={isLive ? "#add-client" : "/onboarding?step=client-portal"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=portal-access">Review access rules</Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-client" className="rounded-[24px]">
          <CardHeader title="Add client" eyebrow="Live portal" />
          <form onSubmit={createClient} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={clientForm.name}
              onChange={(event) => updateClientForm("name", event.target.value)}
              placeholder="Client name"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              value={clientForm.contact}
              onChange={(event) => updateClientForm("contact", event.target.value)}
              placeholder="Contact person"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              type="email"
              value={clientForm.email}
              onChange={(event) => updateClientForm("email", event.target.value)}
              placeholder="Client email"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={clientForm.project}
              onChange={(event) => updateClientForm("project", event.target.value)}
              placeholder="Visible project"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="md:col-span-2 xl:col-span-4">
              <Plus className="h-4 w-4" />
              Add client portal
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <CardHeader title="Launch required" eyebrow="Portal locked" />
          <p className="text-sm leading-6 text-muted">
            Launch the MNC workspace before inviting live clients, exposing projects, or collecting approvals.
          </p>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [CheckCircle2, "Milestones", clients.length ? String(clients.length) : "0"],
          [FileText, "Shared documents", "0"],
          [CreditCard, "Open invoices", String(invoices.length)],
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
        <CardHeader title="Portal activity" eyebrow={clients.length ? "Client access" : portalReady ? "Ready" : "Empty"} />
        {clients.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {clients.map((client) => (
              <div key={client.id} className="rounded-2xl border border-border bg-panel/70 p-4">
                <p className="text-sm font-semibold">{client.name}</p>
                <p className="mt-1 break-all text-sm text-muted">{client.email || "Email pending"}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full border border-border px-2 py-1">
                    {client.contact || "Contact pending"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1">
                    {client.project || "Project visibility pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
            {portalReady
              ? `Portal shell is ready for ${workspaceName}. Activity appears after client users are invited.`
              : "Client approvals, comments, document access, and payments will appear here after launch."}
          </div>
        )}
      </Card>
    </div>
  );
}
