import { expect, test } from "@playwright/test";

test("command center renders and navigates to projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /enterprise command center/i })).toBeVisible();
  const projectsLink = page.getByRole("link", { name: "Projects", exact: true });
  if (!(await projectsLink.isVisible())) {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  }
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.getByRole("heading", { name: /design operations cockpit/i })).toBeVisible();
});
