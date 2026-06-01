"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gate } from "@/components/gate";
import { projects } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const RevenuePipelineChart = dynamic(
  () => import("@/components/dashboard/charts").then((mod) => mod.RevenuePipelineChart),
  { ssr: false, loading: () => <div className="skeleton h-full rounded-xl" /> },
);

const invoices = [
  { id: "INV-2408", client: "Atlas Financial Group", amount: 420000, status: "Due", aging: "12d" },
  { id: "INV-1182", client: "Nova Therapeutics", amount: 185000, status: "Paid", aging: "0d" },
  { id: "INV-0720", client: "Sora Hotels", amount: 96000, status: "Paid", aging: "0d" },
  { id: "INV-5301", client: "Meridian Mobility", amount: 210000, status: "Overdue", aging: "21d" },
];

export function FinanceModule() {
  return (
    <Gate
      permission="financials:view"
      fallback={
        <Card>
          <h2 className="text-xl font-semibold">Financial access restricted</h2>
          <p className="mt-2 text-sm text-muted">CFO, Director, and CEO roles can view this module.</p>
        </Card>
      }
    >
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
          <div>
            <Badge tone="accent">Financial Command</Badge>
            <h2 className="mt-4 text-3xl font-semibold">Revenue, margin, cashflow</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              AI-assisted invoicing, project profitability, consultant spend, accounts
              receivable aging, and 12-month forecast confidence bands.
            </p>
          </div>
          <Button variant="primary">Generate invoice</Button>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Revenue MTD", formatCurrency(4300000), "+16%"],
            ["Gross margin", "31.4%", "+2.1%"],
            ["AR aging", formatCurrency(630000), "2 overdue"],
            ["AI forecast", formatCurrency(27100000), "12 mo."],
          ].map(([label, value, delta]) => (
            <Card key={label}>
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
              <p className="mt-2 text-sm text-accent-2">{delta}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="min-h-[360px]">
            <CardHeader title="Rolling revenue forecast" eyebrow="Millions USD" />
            <div className="h-[280px]">
              <RevenuePipelineChart accent="rgb(var(--positive))" gradientId="financeRevenue" />
            </div>
          </Card>

          <Card>
            <CardHeader title="Project profitability" eyebrow="Fee vs cost" />
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border border-border bg-panel p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{project.name}</p>
                    <Badge tone={project.margin < 18 ? "warning" : "positive"}>{project.margin}%</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {formatCurrency(project.spent)} spent of {formatCurrency(project.budget)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card>
          <CardHeader title="Invoices" eyebrow="Stripe-ready payment links" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] text-muted">
                  {["Invoice", "Client", "Amount", "Status", "Aging"].map((column) => (
                    <th key={column} className="border-b border-border px-3 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="text-muted">
                    <td className="border-b border-border px-3 py-4 font-mono text-xs">{invoice.id}</td>
                    <td className="border-b border-border px-3 py-4 text-text">{invoice.client}</td>
                    <td className="border-b border-border px-3 py-4">{formatCurrency(invoice.amount)}</td>
                    <td className="border-b border-border px-3 py-4">
                      <Badge tone={invoice.status === "Paid" ? "positive" : invoice.status === "Overdue" ? "danger" : "warning"}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="border-b border-border px-3 py-4">{invoice.aging}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Gate>
  );
}
