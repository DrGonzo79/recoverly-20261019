import { expect, test } from "@playwright/test";

test("audits invoices, selects claims, and generates a packet", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: /Find the leak/ })).toBeVisible();
  await page.getByRole("button", { name: /Run contract check/ }).click();
  await expect(page.getByRole("heading", { name: "3 recoverable findings" })).toBeVisible();
  await page.getByText("Loss replacement fee", { exact: true }).click();
  await expect(page.getByText("$48.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Generate claim packet/ }).click();
  await expect(page.getByRole("heading", { name: /2 findings documented for \$48.00/ })).toBeVisible();
  await expect(page.getByText("Nothing was sent.")).toBeVisible();
});

test("validates threshold and supports empty state", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page.getByLabel("Minimum claim value").fill("-1");
  await page.getByRole("button", { name: /Run contract check/ }).click();
  await expect(page.getByText("Enter a review threshold from")).toContainText("$0 to $5,000");
  await page.getByLabel("Minimum claim value").fill("1000");
  await page.getByRole("button", { name: /Run contract check/ }).click();
  await expect(page.getByText("No findings clear this threshold.")).toBeVisible();
});

test("has no horizontal overflow on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("./");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
