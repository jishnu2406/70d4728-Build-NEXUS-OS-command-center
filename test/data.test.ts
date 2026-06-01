import { describe, expect, it } from "vitest";
import { aiAgents, assets, projects, team } from "@/lib/data";

describe("seed operating data", () => {
  it("covers each core command-center surface", () => {
    expect(projects.length).toBeGreaterThanOrEqual(4);
    expect(team.length).toBeGreaterThanOrEqual(4);
    expect(assets.length).toBeGreaterThanOrEqual(4);
    expect(aiAgents.length).toBeGreaterThanOrEqual(4);
  });

  it("has at-risk project signals for the AI brief", () => {
    expect(projects.some((project) => project.status === "At Risk")).toBe(true);
    expect(projects.some((project) => project.status === "Blocked")).toBe(true);
  });
});
