"use client";

import dynamic from "next/dynamic";
import { BadgeCent, CreditCard, FileText, Landmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const RevenuePipelineChart = dynamic(
  () => import("@/components/dashboard/charts").then((mod) => mod.RevenuePipelineChart),
  { ssr: false, loading: () => <div className="skeleton h-full rounded-xl" /> },
);

const financeCards = [
  { label: "Revenue", value: "$0", helper: "Connect invoices" },
  { label: "Margin", value: "0%", helper: "Set cost rules" },
  { label: "AR aging", value: "$0", helper: "Add clients" },
  { label: "Forecast", value: "$0", helper: "Import pipeline" },
];

export function FinanceModule() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={Landmark}
        eyebrow="Financial command"
        title="Connect finance only when the tenant is ready."
        description="Every MNC starts with zero invoices, zero client balances, and no imported forecast. Add Stripe, tax rules, currencies, approval limits, and accounting integrations during setup."
        action="Configure finance"
        actionHref="/onboarding?step=finance"
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-invoices">Import invoices</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {financeCards.map((card) => (
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
          <CardHeader title="Finance setup checklist" eyebrow="Before launch" />
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
        </Card>
      </section>
    </div>
  );
}
