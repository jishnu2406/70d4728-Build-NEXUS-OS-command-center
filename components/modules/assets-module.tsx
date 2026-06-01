"use client";

import { useState } from "react";
import { FileArchive, FileSearch, History, Plus, ShieldCheck, Tags, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
} from "@/stores/workspace-store";

export function AssetsModule() {
  const [assetForm, setAssetForm] = useState({
    name: "",
    category: "",
    owner: "",
    source: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const imports = useWorkspaceStore((state) => state.imports);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const assets = useWorkspaceStore((state) => state.assets);
  const addAsset = useWorkspaceStore((state) => state.addAsset);
  const workspaceName = workspaceDisplayName(profile);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const hasAssetPlan = Boolean(imports.assetSource || imports.knowledgeSource || assets.length);
  const assetCategories = new Set(assets.map((asset) => asset.category).filter(Boolean)).size;

  function updateAssetForm(key: keyof typeof assetForm, value: string) {
    setAssetForm((current) => ({ ...current, [key]: value }));
  }

  function createAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !assetForm.name.trim()) {
      return;
    }

    addAsset({
      name: assetForm.name.trim(),
      category: assetForm.category.trim(),
      owner: assetForm.owner.trim(),
      source: assetForm.source.trim(),
    });
    setAssetForm({
      name: "",
      category: "",
      owner: "",
      source: "",
    });
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={UploadCloud}
        eyebrow="Assets and knowledge"
        title={
          hasAssetPlan
            ? `${workspaceName} asset library is connected.`
            : "Upload the company's first files, brand kit, and knowledge base."
        }
        description={
          hasAssetPlan
            ? `Storage: ${imports.assetSource || "Not selected"}. Knowledge source: ${imports.knowledgeSource || "Not linked yet"}. Files imported for this MNC will appear here.`
            : "This library starts empty for every MNC. Import drawings, contracts, renders, templates, supplier records, standards, and brand assets when the tenant is ready."
        }
        action="Upload files"
        actionHref={isLive ? "#add-asset" : "/onboarding?step=import-data"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=integrations">Connect storage</Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-asset" className="rounded-[24px]">
          <CardHeader title="Add asset" eyebrow="Live library" />
          <form onSubmit={createAsset} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <input
              value={assetForm.name}
              onChange={(event) => updateAssetForm("name", event.target.value)}
              placeholder="Asset name"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              value={assetForm.category}
              onChange={(event) => updateAssetForm("category", event.target.value)}
              placeholder="Category"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={assetForm.owner}
              onChange={(event) => updateAssetForm("owner", event.target.value)}
              placeholder="Owner"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={assetForm.source}
              onChange={(event) => updateAssetForm("source", event.target.value)}
              placeholder="Source"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="md:col-span-2 xl:col-span-4">
              <Plus className="h-4 w-4" />
              Add asset to library
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <CardHeader title="Launch required" eyebrow="Assets locked" />
          <p className="text-sm leading-6 text-muted">
            Launch the MNC workspace before adding operational files, tags, owners, and sources.
          </p>
        </Card>
      )}

      <Card className="rounded-[24px]">
        <CardHeader title="Asset library" eyebrow={assets.length ? "Live records" : hasAssetPlan ? "Configured" : "Empty"} />
        {assets.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {assets.map((asset) => (
              <div key={asset.id} className="rounded-2xl border border-border bg-panel/70 p-4">
                <p className="text-sm font-semibold">{asset.name}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full border border-border px-2 py-1">
                    {asset.category || "Uncategorized"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1">
                    {asset.owner || "Owner pending"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1">
                    {asset.source || imports.assetSource || "Manual upload"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-10 text-center text-sm text-muted">
            {hasAssetPlan
              ? `Ready to sync files from ${imports.assetSource || "the selected source"}.`
              : "No files, tags, versions, or knowledge chunks yet."}
          </div>
        )}
      </Card>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [FileSearch, "AI auto-tagging", assets.length ? `${assets.length} file${assets.length === 1 ? "" : "s"} queued for tagging.` : "Activates after upload and model configuration."],
          [History, "Version history", assets.length ? "New uploads are ready for revision tracking." : "Tracks future revisions and approvals."],
          [ShieldCheck, "Approval workflow", isLive ? "Draft, review, approved, and published states are active." : "Draft, review, approved, and published states are ready."],
          [Tags, "Brand consistency", assetCategories ? `${assetCategories} categor${assetCategories === 1 ? "y" : "ies"} created.` : "Connect a brand kit before checking assets."],
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
              <p className="mt-2 text-sm text-muted">
                {hasAssetPlan ? `Ready for ${workspaceName} records.` : "Empty until this tenant imports records."}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
