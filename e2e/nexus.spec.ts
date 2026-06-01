import { expect, test } from "@playwright/test";

test("command center renders and navigates to projects", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /set up a clean command center/i })).toBeVisible();
  await page.getByRole("link", { name: "Project workspace", exact: true }).click();
  await expect(page.getByRole("heading", { name: /create the first project structure/i })).toBeVisible();
});
