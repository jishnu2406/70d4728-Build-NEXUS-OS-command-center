"use client";

import { motion } from "framer-motion";
import { Brain, CalendarCheck, GitBranch, Sparkles, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gate } from "@/components/gate";
import { team } from "@/lib/data";

export function PeopleModule() {
  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/72 p-5 backdrop-blur-xl lg:flex-row lg:items-end">
        <div>
          <Badge tone="accent">People & Teams</Badge>
          <h2 className="mt-4 text-3xl font-semibold">Capacity, skills, org design</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Directors can inspect workload, skill coverage, leave, performance signals,
            contractor access, and AI balancing recommendations from one planner.
          </p>
        </div>
        <Gate permission="people:manage">
          <Button variant="primary">
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        </Gate>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Team directory" eyebrow="Availability" />
          <div className="grid gap-3 md:grid-cols-2">
            {team.map((person, index) => (
              <motion.article
                key={person.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-panel p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-2/16 text-sm font-semibold text-accent-2">
                      {person.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{person.name}</p>
                      <p className="text-xs text-muted">{person.role}</p>
                    </div>
                  </div>
                  <Badge
                    tone={
                      person.availability === "Overallocated"
                        ? "danger"
                        : person.availability === "Available"
                          ? "positive"
                          : "neutral"
                    }
                  >
                    {person.availability}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted">
                    <span>{person.department}</span>
                    <span>{person.utilization}% utilized</span>
                  </div>
                  <Progress
                    value={person.utilization}
                    tone={person.utilization > 90 ? "danger" : "positive"}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {person.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="AI balancing suggestions" eyebrow="Workload" />
          <div className="space-y-3">
            {[
              "Move Atlas documentation review from Mira to Ishaan for 6 available hours.",
              "Add a contractor to Meridian production QA for three days.",
              "Elena can absorb the Sora board deck polish without crossing 75% capacity.",
            ].map((suggestion) => (
              <div key={suggestion} className="rounded-xl border border-border bg-panel p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-2" />
                  <p className="text-sm font-medium">Recommended</p>
                </div>
                <p className="text-sm leading-6 text-muted">{suggestion}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <GitBranch className="mb-4 h-5 w-5 text-accent-2" />
          <h3 className="text-sm font-semibold">Interactive org chart</h3>
          <div className="mt-5 space-y-3">
            {["CEO", "Directors", "Project Leads", "Design Pods"].map((level, index) => (
              <div
                key={level}
                className="rounded-lg border border-border bg-panel p-3 text-center text-sm text-muted"
                style={{ marginLeft: `${index * 14}px`, marginRight: `${index * 14}px` }}
              >
                {level}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CalendarCheck className="mb-4 h-5 w-5 text-accent-2" />
          <h3 className="text-sm font-semibold">Leave and onboarding</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Two onboarding checklists are active. One senior architect leave request
            intersects an Atlas client workshop.
          </p>
        </Card>
        <Card>
          <Brain className="mb-4 h-5 w-5 text-accent-2" />
          <h3 className="text-sm font-semibold">Skill gap analysis</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Computational design and façade detailing are the tightest skill pools across
            the next 30 days.
          </p>
        </Card>
      </section>
    </div>
  );
}
