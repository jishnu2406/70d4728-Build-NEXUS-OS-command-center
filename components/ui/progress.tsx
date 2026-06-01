import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "positive" | "warning" | "danger";
}) {
  const colors = {
    accent: "bg-accent-2",
    positive: "bg-positive",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-border/60", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-700", colors[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
