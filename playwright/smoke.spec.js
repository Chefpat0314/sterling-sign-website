const { test, expect } = require("@playwright/test");

test("homepage loads and shows a body + title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
  await expect(page).toHaveTitle(/Sterling/i);
});
