import { describe, expect, it } from "vitest";
import { aiAgents, assets, emptyModules, organization, projects, setupSteps, team } from "@/lib/data";

describe("fresh tenant state", () => {
  it("ships without preset company operating data", () => {
    expect(projects).toHaveLength(0);
    expect(team).toHaveLength(0);
    expect(assets).toHaveLength(0);
    expect(aiAgents).toHaveLength(0);
  });

  it("guides first-run setup instead of showing demo records", () => {
    expect(organization.name).toBe("New MNC Workspace");
    expect(setupSteps.length).toBeGreaterThanOrEqual(5);
    expect(emptyModules.every((item) => item.value === "0" || item.value === "$0")).toBe(true);
  });
});
