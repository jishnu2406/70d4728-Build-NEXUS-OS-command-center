import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "panel rounded-xl p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-base font-semibold text-text">{title}</h2>
      </div>
      {action}
    </div>
  );
}
