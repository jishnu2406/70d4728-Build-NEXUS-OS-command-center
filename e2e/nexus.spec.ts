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

  test("onboarding buttons update the active setup panel", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("link", { name: "Invite team", exact: true }).click();
    await expect(page).toHaveURL(/\/onboarding\?step=team/);
    await expect(
      page
        .getByRole("complementary")
        .getByRole("heading", { name: "Invite the leadership team", exact: true }),
    ).toBeVisible();
    await page.getByLabel("CEO / owner email").fill("owner@example.com");
    await page.getByLabel("Default member role").selectOption("Member");
    await page.getByRole("button", { name: "Save invitation plan", exact: true }).click();
    await expect(page.getByRole("main").getByText("20%", { exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Select modules", exact: true }).click();
    await page.getByRole("button", { name: "Architecture", exact: true }).click();
    await page.getByRole("button", { name: "Finance", exact: true }).click();
    await page.getByRole("button", { name: "Apply module setup", exact: true }).click();
    await expect(page.getByRole("main").getByText("40%", { exact: true })).toBeVisible();
  });

  test("saved MNC setup is reflected across the workspace", async ({ page }) => {
    await page.goto("/onboarding?step=identity");
    await page.getByLabel("Company name").fill("Orion Global");
    await page.getByLabel("Company type").selectOption("Architecture");
    await page.getByLabel("Primary region").selectOption("India");
    await page.getByLabel("Currency").selectOption("INR");
    await page.getByRole("button", { name: "Save company profile", exact: true }).click();
    await expect(page.getByText("Profile saved. Creates the tenant identity")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Company name")).toHaveValue("Orion Global");

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Orion Global command center/i })).toBeVisible();

    await page.goto("/admin");
    await expect(page.getByText("Orion Global tenant is registered.")).toBeVisible();
  });

  test("launch unlocks live workspace operations", async ({ page }) => {
    await page.goto("/onboarding?step=identity");
    await page.getByLabel("Company name").fill("Nova Build");
    await page.getByLabel("Company type").selectOption("Architecture");
    await page.getByLabel("Primary region").selectOption("India");
    await page.getByLabel("Currency").selectOption("INR");
    await page.getByRole("button", { name: "Save company profile", exact: true }).click();

    await page.getByRole("link", { name: "Invite team", exact: true }).click();
    await page.getByLabel("CEO / owner email").fill("owner@nova.test");
    await page.getByLabel("Default member role").selectOption("Member");
    await page.getByRole("button", { name: "Save invitation plan", exact: true }).click();

    await page.getByRole("link", { name: "Select modules", exact: true }).click();
    await page.getByRole("button", { name: "Architecture", exact: true }).click();
    await page.getByRole("button", { name: "Finance", exact: true }).click();
    await page.getByRole("button", { name: "Apply module setup", exact: true }).click();

    await page.getByRole("link", { name: "Import data", exact: true }).click();
    await page.getByLabel("Project source").selectOption("Manual setup");
    await page.getByRole("button", { name: "Validate import plan", exact: true }).click();

    await page.getByRole("link", { name: "Review launch", exact: true }).click();
    await page.getByLabel("SSO provider").selectOption("Email login");
    await page.getByLabel("2FA policy").selectOption("Required for admins");
    await page.getByLabel("Monthly AI budget").fill("25000");
    await page.getByLabel("Go-live date").fill("2026-07-01");
    await page.getByRole("button", { name: "Launch MNC workspace", exact: true }).click();
    await expect(page.getByText("Workspace launched.")).toBeVisible();

    await page.goto("/projects");
    await page.getByPlaceholder("Project name").fill("HQ Renovation");
    await page.getByPlaceholder("Client").fill("Nova Holdings");
    await page.getByPlaceholder("Location").fill("Bengaluru");
    await page.getByRole("button", { name: "Add project to workspace", exact: true }).click();
    await expect(page.getByText("HQ Renovation")).toBeVisible();

    await page.goto("/people");
    await page.getByPlaceholder("Full name").fill("Ananya Rao");
    await page.getByPlaceholder("Email").fill("ananya@nova.test");
    await page.getByPlaceholder("Department").fill("Projects");
    await page.getByPlaceholder("Role").fill("Project Manager");
    await page.getByRole("button", { name: "Add employee to directory", exact: true }).click();
    await expect(page.getByText("Ananya Rao")).toBeVisible();

    await page.goto("/assets");
    await page.getByPlaceholder("Asset name").fill("Brand Guidelines");
    await page.getByPlaceholder("Category").fill("Brand");
    await page.getByPlaceholder("Owner").fill("Ananya Rao");
    await page.getByPlaceholder("Source").fill("Drive");
    await page.getByRole("button", { name: "Add asset to library", exact: true }).click();
    await expect(page.getByText("Brand Guidelines")).toBeVisible();

    await page.goto("/finance");
    await page.getByPlaceholder("Invoice client").fill("Nova Holdings");
    await page.getByPlaceholder(/Invoice amount/).fill("500000");
    await page.locator('input[type="date"]').fill("2026-08-01");
    await page.getByRole("button", { name: "Add invoice", exact: true }).click();
    await expect(page.getByText("Open invoices")).toBeVisible();

    await page.goto("/client-portal");
    await page.getByPlaceholder("Client name").fill("Nova Holdings");
    await page.getByPlaceholder("Contact person").fill("Priya Menon");
    await page.getByPlaceholder("Client email").fill("priya@nova.test");
    await page.getByPlaceholder("Visible project").fill("HQ Renovation");
    await page.getByRole("button", { name: "Add client portal", exact: true }).click();
    await expect(page.getByText("Priya Menon")).toBeVisible();

    await page.goto("/intelligence");
    await page.getByPlaceholder("Agent name").fill("Proposal Agent");
    await page.getByPlaceholder("Agent purpose").fill("Draft client proposals");
    await page.getByPlaceholder(/Budget/).fill("5000");
    await page.getByRole("button", { name: "Add AI agent", exact: true }).click();
    await expect(page.getByText("Proposal Agent")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText("1 invoice open")).toBeVisible();
  });

  test("module primary actions navigate to setup", async ({ page }) => {
    await page.goto("/assets");
    await page.getByRole("link", { name: /upload files/i }).click();
    await expect(page).toHaveURL(/\/onboarding\?step=import-data/);
    await expect(
      page
        .getByRole("complementary")
        .getByRole("heading", { name: "Import company data", exact: true }),
    ).toBeVisible();
  });
});
