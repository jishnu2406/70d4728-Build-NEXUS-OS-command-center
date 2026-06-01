"use client";

import { FileArchive, FileSearch, History, ShieldCheck, Tags, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function AssetsModule() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={UploadCloud}
        eyebrow="Assets and knowledge"
        title="Upload the company’s first files, brand kit, and knowledge base."
        description="This library starts empty for every MNC. Import drawings, contracts, renders, templates, supplier records, standards, and brand assets when the tenant is ready."
        action="Upload files"
        actionHref="/onboarding?step=import-data"
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=integrations">Connect storage</Link>
          </Button>
        }
      />

      <Card className="rounded-[24px]">
        <CardHeader title="Asset library" eyebrow="Empty" />
        <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
          No files, tags, versions, or knowledge chunks yet.
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [FileSearch, "AI auto-tagging", "Activates after upload and model configuration."],
          [History, "Version history", "Tracks future revisions and approvals."],
          [ShieldCheck, "Approval workflow", "Draft, review, approved, and published states are ready."],
          [Tags, "Brand consistency", "Connect a brand kit before checking assets."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{String(title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{String(description)}</p>
          </Card>
        ))}
      </section>

      <Card className="rounded-[24px]">
        <CardHeader title="Standard details vault" eyebrow="Architecture-ready" />
        <div className="grid gap-3 md:grid-cols-3">
          {["Details", "Specifications", "Suppliers"].map((item) => (
            <div key={item} className="rounded-2xl border border-dashed border-border bg-panel/50 p-5">
              <FileArchive className="mb-3 h-5 w-5 text-accent-2" />
              <p className="text-sm font-semibold">{item}</p>
              <p className="mt-2 text-sm text-muted">Empty until this tenant imports records.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
