"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BadgeCent, CreditCard, FileText, Landmark, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
} from "@/stores/workspace-store";

const RevenuePipelineChart = dynamic(
  () => import("@/components/dashboard/charts").then((mod) => mod.RevenuePipelineChart),
  { ssr: false, loading: () => <div className="skeleton h-full rounded-xl" /> },
);

function parseAmount(value: string) {
  return Number(value.replace(/[^\d.-]/g, "")) || 0;
}

function formatCurrency(value: number, currency: string) {
  if (/^[A-Z]{3}$/.test(currency)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return `${currency || "$"}${value.toLocaleString("en-US")}`;
}

export function FinanceModule() {
  const [invoiceForm, setInvoiceForm] = useState({
    client: "",
    amount: "",
    dueDate: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const imports = useWorkspaceStore((state) => state.imports);
  const launch = useWorkspaceStore((state) => state.launch);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const invoices = useWorkspaceStore((state) => state.invoices);
  const addInvoice = useWorkspaceStore((state) => state.addInvoice);
  const workspaceName = workspaceDisplayName(profile);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const hasFinancePlan = Boolean(imports.invoiceSource || launch.aiBudget || profile.currency || invoices.length);
  const currency = profile.currency || "$";
  const openInvoiceTotal = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);
  const cards = [
    { label: "Revenue", value: formatCurrency(openInvoiceTotal, currency), helper: invoices.length ? `${invoices.length} open invoice${invoices.length === 1 ? "" : "s"}` : imports.invoiceSource || "Connect invoices" },
    { label: "Margin", value: "0%", helper: "Set cost rules" },
    { label: "AR aging", value: formatCurrency(openInvoiceTotal, currency), helper: invoices.length ? "Invoices awaiting collection" : "Add clients" },
    { label: "Forecast", value: formatCurrency(0, currency), helper: imports.projectSource || "Import pipeline" },
  ];

  function updateInvoiceForm(key: keyof typeof invoiceForm, value: string) {
    setInvoiceForm((current) => ({ ...current, [key]: value }));
  }

  function createInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !invoiceForm.client.trim() || !invoiceForm.amount.trim()) {
      return;
    }

    addInvoice({
      client: invoiceForm.client.trim(),
      amount: invoiceForm.amount.trim(),
      dueDate: invoiceForm.dueDate,
    });
    setInvoiceForm({
      client: "",
      amount: "",
      dueDate: "",
    });
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={Landmark}
        eyebrow="Financial command"
        title={
          hasFinancePlan
            ? `${workspaceName} finance settings are prepared.`
            : "Connect finance only when the tenant is ready."
        }
        description={
          hasFinancePlan
            ? `Currency: ${profile.currency || "Not selected"}. Invoice source: ${imports.invoiceSource || "Not linked yet"}. Values stay zero until real invoices are imported.`
            : "Every MNC starts with zero invoices, zero client balances, and no imported forecast. Add Stripe, tax rules, currencies, approval limits, and accounting integrations during setup."
        }
        action="Configure finance"
        actionHref={isLive ? "#add-invoice" : "/onboarding?step=finance"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-invoices">Import invoices</Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-invoice" className="rounded-[24px]">
          <CardHeader title="Add invoice" eyebrow="Live finance" />
          <form onSubmit={createInvoice} className="grid gap-3 md:grid-cols-[1fr_0.7fr_0.7fr]">
            <input
              value={invoiceForm.client}
              onChange={(event) => updateInvoiceForm("client", event.target.value)}
              placeholder="Invoice client"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              inputMode="decimal"
              value={invoiceForm.amount}
              onChange={(event) => updateInvoiceForm("amount", event.target.value)}
              placeholder={`Invoice amount (${currency})`}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              type="date"
              value={invoiceForm.dueDate}
              onChange={(event) => updateInvoiceForm("dueDate", event.target.value)}
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="md:col-span-3">
              <Plus className="h-4 w-4" />
              Add invoice
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <CardHeader title="Launch required" eyebrow="Finance locked" />
          <p className="text-sm leading-6 text-muted">
            Launch the MNC workspace before adding live invoices, balances, payments, and finance workflows.
          </p>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="rounded-[24px]">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="min-h-[340px] rounded-[24px]">
          <CardHeader title="Forecast baseline" eyebrow="Empty chart" />
          <div className="h-[250px]">
            <RevenuePipelineChart accent="rgb(var(--positive))" gradientId="financeRevenue" />
          </div>
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader title={invoices.length ? "Invoice register" : "Finance setup checklist"} eyebrow={invoices.length ? "Open invoices" : "Before launch"} />
          {invoices.length ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-border bg-panel/65 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{invoice.client}</p>
                      <p className="mt-1 text-xs text-muted">{invoice.dueDate || "Due date pending"}</p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
                      {invoice.status}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold">
                    {formatCurrency(parseAmount(invoice.amount), currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                [BadgeCent, "Currencies and tax"],
                [CreditCard, "Payment providers"],
                [FileText, "Invoice templates"],
              ].map(([Icon, label]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-border bg-panel/65 p-4">
                  <Icon className="h-5 w-5 text-accent-2" />
                  <p className="text-sm font-medium">{String(label)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
