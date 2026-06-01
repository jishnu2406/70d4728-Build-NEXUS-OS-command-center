import { expect, test } from "@playwright/test";

const routes = [
  ["/", /set up a clean command center/i],
  ["/onboarding", /launch a tenant workspace/i],
  ["/projects", /create the first project structure/i],
  ["/people", /invite the company team/i],
  ["/assets", /upload the company/i],
  ["/finance", /connect finance/i],
  ["/intelligence", /ai is off until this mnc configures/i],
  ["/client-portal", /no clients are visible/i],
  ["/settings", /personalization and controls/i],
  ["/admin", /platform control starts empty/i],
] as const;

test.describe("fresh MNC OS", () => {
  for (const [route, heading] of routes) {
    test(`renders ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("command center launchpad navigates to project workspace", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /set up a clean command center/i })).toBeVisible();
    await page.getByRole("link", { name: "Project workspace", exact: true }).click();
    await expect(page.getByRole("heading", { name: /create the first project structure/i })).toBeVisible();
  });

  test("project view tabs switch cleanly", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("tab", { name: "Table", exact: true }).click();
    await expect(page.getByText("No project rows yet.")).toBeVisible();
    await page.getByRole("tab", { name: "Calendar", exact: true }).click();
    await expect(page.getByText("Milestones will appear")).toBeVisible();
    await page.getByRole("tab", { name: "Map", exact: true }).click();
    await expect(page.getByText("Add project locations")).toBeVisible();
    await page.getByRole("tab", { name: "Kanban", exact: true }).click();
    await expect(page.getByText("Drop future projects here").first()).toBeVisible();
  });
});
