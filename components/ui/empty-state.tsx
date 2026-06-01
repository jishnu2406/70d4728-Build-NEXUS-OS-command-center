import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  actionHref = "/onboarding",
  secondary,
  className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
  secondary?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface/72 p-6 backdrop-blur-xl md:p-8",
        className,
      )}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="flex max-w-3xl flex-col gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-panel/80 text-accent-2 shadow-lift">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          {eyebrow ? (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold leading-tight text-text md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {action ? (
            <Button asChild variant="primary">
              <Link href={actionHref}>
                {action}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          {secondary}
        </div>
      </div>
    </div>
  );
}
