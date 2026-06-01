import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "positive" | "warning" | "danger" | "accent";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border bg-panel text-muted",
  positive: "border-positive/35 bg-positive/12 text-positive",
  warning: "border-warning/35 bg-warning/12 text-warning",
  danger: "border-danger/35 bg-danger/12 text-danger",
  accent: "border-accent-2/35 bg-accent-2/12 text-accent-2",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
