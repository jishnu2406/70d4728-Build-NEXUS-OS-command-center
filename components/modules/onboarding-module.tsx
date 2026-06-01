"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Building2,
  Cable,
  Check,
  CircleAlert,
  FolderPlus,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { setupSteps } from "@/lib/data";

type FieldControl = {
  key: string;
  label: string;
  type: "text" | "select" | "color" | "date" | "number";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type ToggleControl = {
  key: string;
  label: string;
  type: "toggles";
  options: string[];
  required?: boolean;
};

type SetupControl = FieldControl | ToggleControl;

type StepPlan = {
  id: string;
  routeKey: string;
  aliases: string[];
  cardAction: string;
  panelAction: string;
  completeLabel: string;
  helper: string;
  outcome: string;
  controls: SetupControl[];
};

const icons = [Building2, Users, Bot, FolderPlus, Cable];

const stepPlans: StepPlan[] = [
  {
    id: "identity",
    routeKey: "identity",
    aliases: ["identity", "company", "mnc", "tenant", "name"],
    cardAction: "Start profile",
    panelAction: "Save company profile",
    completeLabel: "Profile saved",
    helper: "Create the company shell without sample data.",
    outcome: "Creates the tenant identity, display name, slug, default locale, and brand theme.",
    controls: [
      {
        key: "companyName",
        label: "Company name",
        type: "text",
        placeholder: "Enter the MNC legal or workspace name",
        required: true,
      },
      {
        key: "companyType",
        label: "Company type",
        type: "select",
        required: true,
        options: ["Architecture", "Interiors", "Production", "Brand studio", "Multi-division MNC"],
      },
      {
        key: "region",
        label: "Primary region",
        type: "select",
        required: true,
        options: ["India", "United States", "Middle East", "Europe", "Asia Pacific"],
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        required: true,
        options: ["INR", "USD", "AED", "EUR", "GBP"],
      },
      { key: "brandColor", label: "Brand color", type: "color", required: true },
    ],
  },
  {
    id: "teams",
    routeKey: "team",
    aliases: ["team", "teams", "people", "invite", "import-people", "leadership"],
    cardAction: "Invite team",
    panelAction: "Save invitation plan",
    completeLabel: "Invites prepared",
    helper: "Prepare leadership, finance, project, client, and contractor access.",
    outcome: "Builds role hierarchy, invitation batches, and default permission groups.",
    controls: [
      {
        key: "ownerEmail",
        label: "CEO / owner email",
        type: "text",
        placeholder: "owner@company.com",
        required: true,
      },
      {
        key: "financeEmail",
        label: "Finance admin email",
        type: "text",
        placeholder: "finance@company.com",
      },
      {
        key: "projectLeadEmail",
        label: "Project lead email",
        type: "text",
        placeholder: "projects@company.com",
      },
      {
        key: "defaultRole",
        label: "Default member role",
        type: "select",
        required: true,
        options: ["Member", "Project lead", "Client reviewer", "Contractor"],
      },
    ],
  },
  {
    id: "modules",
    routeKey: "modules",
    aliases: [
      "modules",
      "finance",
      "ai",
      "client-portal",
      "feature-flags",
      "model-router",
      "super-admin",
    ],
    cardAction: "Select modules",
    panelAction: "Apply module setup",
    completeLabel: "Modules applied",
    helper: "Turn on only what this company needs for launch.",
    outcome: "Enables the selected operating modules and keeps unused modules hidden.",
    controls: [
      {
        key: "enabledModules",
        label: "Launch modules",
        type: "toggles",
        required: true,
        options: [
          "Architecture",
          "Interiors",
          "Production",
          "Brand",
          "Finance",
          "Client portal",
          "AI layer",
          "Admin console",
        ],
      },
    ],
  },
  {
    id: "data",
    routeKey: "import-data",
    aliases: [
      "data",
      "import",
      "import-data",
      "first-project",
      "assets",
      "upload",
      "integrations",
      "import-invoices",
    ],
    cardAction: "Import data",
    panelAction: "Validate import plan",
    completeLabel: "Imports validated",
    helper: "Connect real company sources without shipping demo records.",
    outcome: "Creates clean import lanes for projects, people, assets, invoices, and knowledge.",
    controls: [
      {
        key: "projectSource",
        label: "Project source",
        type: "select",
        required: true,
        options: ["CSV / Excel", "Notion", "Asana", "Monday", "Manual setup"],
      },
      {
        key: "assetSource",
        label: "Asset storage",
        type: "select",
        options: ["Google Drive", "OneDrive", "Dropbox", "S3", "Local upload"],
      },
      {
        key: "invoiceSource",
        label: "Invoice source",
        type: "select",
        options: ["QuickBooks", "Tally", "Zoho Books", "Stripe", "Manual setup"],
      },
      {
        key: "knowledgeSource",
        label: "Knowledge base",
        type: "text",
        placeholder: "Paste a docs, drive, or wiki source",
      },
    ],
  },
  {
    id: "launch",
    routeKey: "launch",
    aliases: ["launch", "review", "billing", "sso", "security", "go-live"],
    cardAction: "Review launch",
    panelAction: "Run launch review",
    completeLabel: "Launch ready",
    helper: "Confirm security, billing, integrations, and AI governance before handoff.",
    outcome: "Locks launch settings and marks the tenant ready for the MNC team.",
    controls: [
      {
        key: "ssoProvider",
        label: "SSO provider",
        type: "select",
        required: true,
        options: ["Google Workspace", "Microsoft Entra", "Okta", "Email login"],
      },
      {
        key: "twoFactor",
        label: "2FA policy",
        type: "select",
        required: true,
        options: ["Required for all", "Required for admins", "Optional"],
      },
      {
        key: "aiBudget",
        label: "Monthly AI budget",
        type: "number",
        placeholder: "0",
        required: true,
      },
      {
        key: "goLiveDate",
        label: "Go-live date",
        type: "date",
        required: true,
      },
    ],
  },
];

const initialFieldValues: Record<string, string> = {
  brandColor: "#6c63ff",
  companyType: "",
  currency: "",
  defaultRole: "",
  projectSource: "",
  region: "",
  ssoProvider: "",
  twoFactor: "",
};

const initialToggleValues: Record<string, string[]> = {
  enabledModules: [],
};

function resolveStepIndex(stepKey?: string) {
  if (!stepKey) {
    return 0;
  }

  const normalized = stepKey.toLowerCase().trim();
  const index = stepPlans.findIndex((step) =>
    [step.id, step.routeKey, ...step.aliases].includes(normalized),
  );

  return index >= 0 ? index : 0;
}

function isFieldControl(control: SetupControl): control is FieldControl {
  return control.type !== "toggles";
}

export function OnboardingModule({ initialStepKey }: { initialStepKey?: string }) {
  const initialStep = useMemo(() => resolveStepIndex(initialStepKey), [initialStepKey]);
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(initialFieldValues);
  const [toggleValues, setToggleValues] = useState<Record<string, string[]>>(initialToggleValues);
  const [notice, setNotice] = useState(stepPlans[initialStep].helper);

  const progress = Math.round((completedSteps.length / stepPlans.length) * 100);
  const activePlan = stepPlans[activeStep];
  const ActiveIcon = icons[activeStep] ?? Building2;
  const selectedStep = setupSteps[activeStep];

  function openStep(index: number) {
    const plan = stepPlans[index];

    setActiveStep(index);
    setNotice(plan.helper);
    window.history.replaceState(null, "", `/onboarding?step=${plan.routeKey}`);
  }

  function updateField(key: string, value: string) {
    setFieldValues((current) => ({ ...current, [key]: value }));
  }

  function toggleOption(key: string, option: string) {
    setToggleValues((current) => {
      const selected = current[key] ?? [];
      const nextSelected = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];

      return { ...current, [key]: nextSelected };
    });
  }

  function missingControls(plan: StepPlan) {
    return plan.controls
      .filter((control) => {
        if (!control.required) {
          return false;
        }

        if (control.type === "toggles") {
          return !(toggleValues[control.key] ?? []).length;
        }

        return !fieldValues[control.key]?.trim();
      })
      .map((control) => control.label);
  }

  function markCompleted(index: number) {
    setCompletedSteps((current) => (current.includes(index) ? current : [...current, index]));
  }

  function runStepAction(index = activeStep) {
    const plan = stepPlans[index];
    const missing = missingControls(plan);

    setActiveStep(index);
    window.history.replaceState(null, "", `/onboarding?step=${plan.routeKey}`);

    if (index === stepPlans.length - 1 && completedSteps.length < stepPlans.length - 1) {
      setNotice("Finish identity, team, modules, and imports before final launch review.");
      return;
    }

    if (missing.length) {
      setNotice(`Add ${missing.join(", ")} to complete ${setupSteps[index].title}.`);
      return;
    }

    markCompleted(index);
    setNotice(`${plan.completeLabel}. ${plan.outcome}`);
  }

  function resetStep(index = activeStep) {
    const plan = stepPlans[index];
    const resetFields = plan.controls.filter(isFieldControl).map((control) => control.key);
    const resetToggles = plan.controls
      .filter((control): control is ToggleControl => control.type === "toggles")
      .map((control) => control.key);

    setFieldValues((current) => {
      const next = { ...current };
      resetFields.forEach((key) => {
        next[key] = initialFieldValues[key] ?? "";
      });
      return next;
    });
    setToggleValues((current) => {
      const next = { ...current };
      resetToggles.forEach((key) => {
        next[key] = [];
      });
      return next;
    });
    setCompletedSteps((current) => current.filter((item) => item !== index));
    setNotice(`${setupSteps[index].title} has been cleared for a fresh setup.`);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="rounded-[28px] border border-border bg-surface/72 p-6 backdrop-blur-2xl md:p-8">
        <Badge tone="accent">First-run setup</Badge>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <h2 className="text-4xl font-semibold leading-tight">Launch a tenant workspace</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:text-base">
              This wizard stays blank for each MNC until their real profile, people,
              modules, imports, security, and launch rules are entered.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-panel/70 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Setup progress</span>
              <span className="text-muted">{progress}%</span>
            </div>
            <Progress value={progress} tone={progress === 100 ? "positive" : "accent"} />
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 2xl:grid-cols-[minmax(560px,1fr)_420px]">
        <div className="order-2 grid gap-4 2xl:order-1">
          {setupSteps.map((step, index) => {
            const Icon = icons[index] ?? Building2;
            const plan = stepPlans[index];
            const complete = completedSteps.includes(index);
            const active = activeStep === index;
            const missing = missingControls(plan).length;

            return (
              <Card
                key={step.id}
                className={cn(
                  "grid gap-4 rounded-[24px] p-5 shadow-lift sm:grid-cols-[auto_1fr] sm:items-start 2xl:grid-cols-[auto_1fr_auto] 2xl:items-center",
                  active && "border-accent-2/50 bg-accent-2/10",
                )}
              >
                <button
                  type="button"
                  onClick={() => openStep(index)}
                  className={cn(
                    "focus-ring flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-panel",
                    active && "border-accent-2/40 bg-accent-2/12",
                    complete && "border-positive/35 bg-positive/12",
                  )}
                  aria-label={`Open ${step.title}`}
                >
                  {complete ? (
                    <Check className="h-5 w-5 text-positive" />
                  ) : (
                    <Icon className="h-5 w-5 text-accent-2" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openStep(index)}
                  className="focus-ring min-w-0 rounded-2xl text-left"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs text-accent-2">Step {index + 1}</p>
                    <Badge tone={complete ? "positive" : active ? "accent" : "neutral"}>
                      {complete ? plan.completeLabel : active ? "Active" : `${missing} required`}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
                </button>

                <div className="flex flex-wrap gap-2 sm:col-start-2 2xl:col-start-auto 2xl:justify-end">
                  <Button asChild variant={active ? "primary" : "secondary"}>
                    <Link
                      href={`/onboarding?step=${plan.routeKey}`}
                      onClick={() => openStep(index)}
                    >
                      {plan.cardAction}
                    </Link>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => runStepAction(index)}>
                    {complete ? "Recheck" : "Complete"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <aside
          className="panel order-1 h-fit rounded-[24px] p-5 2xl:sticky 2xl:top-20 2xl:order-2"
          role="complementary"
        >
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-2/12 text-accent-2">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Active setup</p>
              <h3 className="mt-1 text-lg font-semibold">{selectedStep.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{activePlan.helper}</p>
            </div>
          </div>

          <div className="space-y-3">
            {activePlan.controls.map((control) => {
              if (control.type === "toggles") {
                const selected = toggleValues[control.key] ?? [];

                return (
                  <div key={control.key} className="rounded-2xl border border-border bg-panel/70 p-3">
                    <p className="mb-3 text-sm font-medium">
                      {control.label}
                      {control.required ? <span className="text-accent-2"> *</span> : null}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {control.options.map((option) => {
                        const pressed = selected.includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={pressed}
                            onClick={() => toggleOption(control.key, option)}
                            className={cn(
                              "focus-ring rounded-full border px-3 py-2 text-xs font-medium transition",
                              pressed
                                ? "border-accent-2/45 bg-accent-2/16 text-accent-2"
                                : "border-border bg-surface/70 text-muted hover:text-text",
                            )}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <label
                  key={control.key}
                  className="block rounded-2xl border border-border bg-panel/70 p-3 text-sm"
                >
                  <span className="mb-2 block font-medium">
                    {control.label}
                    {control.required ? <span className="text-accent-2"> *</span> : null}
                  </span>
                  {control.type === "select" ? (
                    <select
                      value={fieldValues[control.key] ?? ""}
                      onChange={(event) => updateField(control.key, event.target.value)}
                      className="focus-ring h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text"
                    >
                      <option value="">Select {control.label.toLowerCase()}</option>
                      {control.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : control.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input
                        aria-label={control.label}
                        type="color"
                        value={fieldValues[control.key] ?? "#6c63ff"}
                        onChange={(event) => updateField(control.key, event.target.value)}
                        className="h-10 w-14 rounded-xl border border-border bg-surface p-1"
                      />
                      <span className="text-sm text-muted">
                        {fieldValues[control.key] ?? "#6c63ff"}
                      </span>
                    </div>
                  ) : (
                    <input
                      type={control.type}
                      value={fieldValues[control.key] ?? ""}
                      onChange={(event) => updateField(control.key, event.target.value)}
                      placeholder={control.placeholder}
                      className="focus-ring h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text placeholder:text-muted"
                    />
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              {notice.includes("Add ") || notice.includes("Finish ") ? (
                <CircleAlert className="h-4 w-4 text-warning" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-accent-2" />
              )}
              Setup response
            </div>
            <p className="text-sm leading-6 text-muted">{notice}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-panel/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Rocket className="h-4 w-4 text-accent-2" />
              Outcome
            </div>
            <p className="text-sm leading-6 text-muted">{activePlan.outcome}</p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="primary" onClick={() => runStepAction(activeStep)}>
              {activePlan.panelAction}
            </Button>
            <Button type="button" variant="outline" onClick={() => resetStep(activeStep)}>
              Clear step
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
