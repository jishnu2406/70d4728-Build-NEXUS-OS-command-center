"use client";

import { FileArchive, FileSearch, History, Search, ShieldCheck, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { assets } from "@/lib/data";

export function AssetsModule() {
  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
      <section className="rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl">
        <Badge tone="accent">Assets & Knowledge</Badge>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <h2 className="text-3xl font-semibold">Semantic file command</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Versioned drawings, renders, contracts, brand kits, standard details,
              supplier knowledge, and lessons learned are ready for RAG search and AI
              auto-tagging.
            </p>
          </div>
          <div className="flex rounded-xl border border-border bg-panel p-2">
            <Search className="mx-2 mt-2 h-4 w-4 text-muted" />
            <input
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              placeholder="Find all section drawings from residential projects..."
            />
            <Button variant="primary" size="sm">Search</Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader title="Asset library" eyebrow="Version controlled" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] text-muted">
                  {["Name", "Type", "Project", "Version", "Status", "Tags"].map((column) => (
                    <th key={column} className="border-b border-border px-3 py-3">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="text-muted">
                    <td className="border-b border-border px-3 py-4 text-text">{asset.name}</td>
                    <td className="border-b border-border px-3 py-4">{asset.type}</td>
                    <td className="border-b border-border px-3 py-4">{asset.project}</td>
                    <td className="border-b border-border px-3 py-4 font-mono text-xs">
                      {asset.version}
                    </td>
                    <td className="border-b border-border px-3 py-4">
                      <Badge
                        tone={
                          asset.status === "Approved" || asset.status === "Published"
                            ? "positive"
                            : asset.status === "Review"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="border-b border-border px-3 py-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-panel px-2 py-1 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Knowledge graph" eyebrow="pgvector-ready" />
          <div className="space-y-3">
            {[
              ["Chunks indexed", "24,180"],
              ["Approved standard details", "318"],
              ["Supplier records", "96"],
              ["Brand kit templates", "42"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-panel p-4">
                <span className="text-sm text-muted">{label}</span>
                <span className="text-lg font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [FileSearch, "AI auto-tagging", "Vision models label drawings, renders, and site photos."],
          [History, "Diff viewer", "Document versions retain approvals and comments."],
          [ShieldCheck, "Approval workflow", "Draft, review, approved, and published states."],
          [Tags, "Brand consistency", "Logo, color, and typography checks per workspace."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)}>
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{String(title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{String(description)}</p>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader title="Standard details vault" eyebrow="Architecture module" />
        <div className="grid gap-3 md:grid-cols-3">
          {["Rainscreen facade", "Accessible restroom", "Fire stair core"].map((detail) => (
            <div key={detail} className="rounded-xl border border-border bg-panel p-4">
              <FileArchive className="mb-3 h-5 w-5 text-accent-2" />
              <p className="text-sm font-semibold">{detail}</p>
              <p className="mt-2 text-sm text-muted">Linked to specifications and code checklist.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
