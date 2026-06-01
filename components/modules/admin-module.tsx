"use client";

import { Activity, Building2, Flag, Gauge, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Gate } from "@/components/gate";
import { formatCurrency } from "@/lib/utils";

const orgs = [
  { name: "Foster + Partners Studio", users: 248, revenue: 2180000, health: 94 },
  { name: "Northline Interiors", users: 82, revenue: 640000, health: 88 },
  { name: "Signal Brand Group", users: 54, revenue: 390000, health: 91 },
  { name: "Meridian Production", users: 103, revenue: 780000, health: 76 },
];

export function AdminModule() {
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
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
          <div>
            <Badge tone="accent">Super Admin</Badge>
            <h2 className="mt-4 text-3xl font-semibold">Platform control plane</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Tenant health, platform AI costs, feature flags, billing, impersonation,
              broadcasts, system metrics, and cross-tenant audit trails.
            </p>
          </div>
          <Button variant="primary">
            <Flag className="h-4 w-4" />
            New feature flag
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            [Building2, "Organizations", "128"],
            [Users, "Users", "18,420"],
            [Gauge, "MRR", formatCurrency(742000)],
            [Activity, "P95 latency", "148ms"],
          ].map(([Icon, label, value]) => (
            <Card key={String(label)}>
              <Icon className="mb-4 h-5 w-5 text-accent-2" />
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{String(label)}</p>
              <p className="mt-3 text-2xl font-semibold">{String(value)}</p>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader title="Organization health" eyebrow="Tenant overview" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] text-muted">
                  {["Organization", "Users", "Revenue", "Health", "Access"].map((column) => (
                    <th key={column} className="border-b border-border px-3 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.name} className="text-muted">
                    <td className="border-b border-border px-3 py-4 text-text">{org.name}</td>
                    <td className="border-b border-border px-3 py-4">{org.users}</td>
                    <td className="border-b border-border px-3 py-4">{formatCurrency(org.revenue)}</td>
                    <td className="border-b border-border px-3 py-4">
                      <Badge tone={org.health < 80 ? "warning" : "positive"}>{org.health}%</Badge>
                    </td>
                    <td className="border-b border-border px-3 py-4">
                      <Button variant="ghost" size="sm">
                        <ShieldCheck className="h-4 w-4" />
                        Audit impersonation
                      </Button>
                    </td>
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
