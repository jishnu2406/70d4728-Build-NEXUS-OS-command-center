"use client";

import { Brain, CalendarCheck, GitBranch, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function PeopleModule() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={UsersRound}
        eyebrow="People"
        title="Invite the company team and define departments."
        description="Start with a clean directory. Add leadership, departments, locations, roles, capacity rules, clients, contractors, and AI agent identities for this MNC."
        action="Invite first user"
        actionHref="/onboarding?step=team"
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-people">
              <UserPlus className="h-4 w-4" />
              Import people CSV
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          [GitBranch, "Org chart", "Build the first reporting structure and approval lines."],
          [CalendarCheck, "Capacity planning", "Set working hours, locations, leave policy, and allocation rules."],
          [Brain, "Skill matrix", "Define skills and certifications before AI workload balancing is enabled."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)} className="rounded-[24px]">
            <Icon className="mb-4 h-5 w-5 text-accent-2" />
            <h3 className="text-sm font-semibold">{String(title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{String(description)}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
