"use client";

import { useState } from "react";
import { Brain, CalendarCheck, GitBranch, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useWorkspaceStore,
  workspaceDisplayName,
  workspaceIsLive,
  workspaceTeamCount,
} from "@/stores/workspace-store";

export function PeopleModule() {
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    location: "",
  });
  const profile = useWorkspaceStore((state) => state.profile);
  const team = useWorkspaceStore((state) => state.team);
  const completedSteps = useWorkspaceStore((state) => state.completedSteps);
  const launchedAt = useWorkspaceStore((state) => state.launchedAt);
  const employees = useWorkspaceStore((state) => state.employees);
  const addEmployee = useWorkspaceStore((state) => state.addEmployee);
  const teamCount = workspaceTeamCount(team);
  const isLive = workspaceIsLive(launchedAt, completedSteps);
  const workspaceName = workspaceDisplayName(profile);
  const peopleCount = teamCount + employees.length;
  const invitedPeople = [
    ["CEO / owner", team.ownerEmail],
    ["Finance admin", team.financeEmail],
    ["Project lead", team.projectLeadEmail],
  ].filter(([, email]) => email);

  function updateEmployeeForm(key: keyof typeof employeeForm, value: string) {
    setEmployeeForm((current) => ({ ...current, [key]: value }));
  }

  function createEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLive || !employeeForm.name.trim() || !employeeForm.email.trim()) {
      return;
    }

    addEmployee({
      name: employeeForm.name.trim(),
      email: employeeForm.email.trim(),
      department: employeeForm.department.trim(),
      role: employeeForm.role.trim(),
      location: employeeForm.location.trim(),
    });
    setEmployeeForm({
      name: "",
      email: "",
      department: "",
      role: "",
      location: "",
    });
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <EmptyState
        icon={UsersRound}
        eyebrow="People"
        title={
          isLive
            ? `${workspaceName} team directory is live.`
            : teamCount
            ? `${workspaceName} has ${teamCount} leadership invite${teamCount === 1 ? "" : "s"} ready.`
            : "Invite the company team and define departments."
        }
        description={
          isLive
            ? `${peopleCount} people are represented so far. Add employees, departments, roles, locations, clients, contractors, and AI agent identities here.`
            : teamCount
            ? `Default role: ${team.defaultRole || "Not selected"}. Continue adding departments, locations, clients, contractors, and AI agent identities for this MNC.`
            : "Start with a clean directory. Add leadership, departments, locations, roles, capacity rules, clients, contractors, and AI agent identities for this MNC."
        }
        action={isLive ? "Add employee below" : "Invite first user"}
        actionHref={isLive ? "#add-employee" : "/onboarding?step=team"}
        secondary={
          <Button asChild variant="glass">
            <Link href="/onboarding?step=import-people">
              <UserPlus className="h-4 w-4" />
              Import people CSV
            </Link>
          </Button>
        }
      />

      {isLive ? (
        <Card id="add-employee" className="rounded-[24px]">
          <h3 className="text-sm font-semibold">Add employee</h3>
          <form onSubmit={createEmployee} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              value={employeeForm.name}
              onChange={(event) => updateEmployeeForm("name", event.target.value)}
              placeholder="Full name"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              type="email"
              value={employeeForm.email}
              onChange={(event) => updateEmployeeForm("email", event.target.value)}
              placeholder="Email"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
              required
            />
            <input
              value={employeeForm.department}
              onChange={(event) => updateEmployeeForm("department", event.target.value)}
              placeholder="Department"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={employeeForm.role}
              onChange={(event) => updateEmployeeForm("role", event.target.value)}
              placeholder="Role"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <input
              value={employeeForm.location}
              onChange={(event) => updateEmployeeForm("location", event.target.value)}
              placeholder="Location"
              className="focus-ring h-11 rounded-xl border border-border bg-panel px-3 text-sm outline-none"
            />
            <Button type="submit" variant="primary" className="md:col-span-2 lg:col-span-5">
              <UserPlus className="h-4 w-4" />
              Add employee to directory
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="rounded-[24px]">
          <h3 className="text-sm font-semibold">Launch required</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Complete onboarding and launch the MNC workspace before adding operational employees.
          </p>
        </Card>
      )}

      {invitedPeople.length ? (
        <Card className="rounded-[24px]">
          <h3 className="text-sm font-semibold">Leadership invitation plan</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {invitedPeople.map(([role, email]) => (
              <div key={role} className="rounded-2xl border border-border bg-panel/70 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">{role}</p>
                <p className="mt-2 break-all text-sm font-medium">{email}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {employees.length ? (
        <Card className="rounded-[24px]">
          <h3 className="text-sm font-semibold">Employee directory</h3>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {employees.map((employee) => (
              <div key={employee.id} className="rounded-2xl border border-border bg-panel/70 p-4">
                <p className="text-sm font-semibold">{employee.name}</p>
                <p className="mt-1 break-all text-sm text-muted">{employee.email}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full border border-border px-2 py-1">
                    {employee.department || "Department pending"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1">
                    {employee.role || "Role pending"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-1">
                    {employee.location || "Location pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

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
