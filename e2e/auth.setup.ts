import { expect, test as setup } from "@playwright/test";

import { AUTH_FILE } from "../playwright.config";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

setup("log in", async ({ page }) => {
  setup.skip(
    !email || !password,
    "Set E2E_EMAIL and E2E_PASSWORD to run the logged-in tests",
  );

  await page.goto("/login");
  await page.getByLabel("Email").fill(email ?? "");
  await page.getByLabel("Password").fill(password ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: AUTH_FILE });
});
