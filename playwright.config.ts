import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests. By default they start `npm run dev` and run against localhost.
 *
 * - E2E_BASE_URL: run against a deployment instead (e.g. a Vercel preview)
 * - VERCEL_AUTOMATION_BYPASS_SECRET: needed for protected Vercel previews
 * - E2E_EMAIL / E2E_PASSWORD: enable the logged-in tests (use a test account)
 * - E2E_ALLOW_WRITES=1: also run the checkout test, which creates a real order
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export const AUTH_FILE = "e2e/.auth/user.json";

export default defineConfig({
  testDir: "./e2e",
  // The logged-in tests share one account (and its cart), so don't run in parallel
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    extraHTTPHeaders: bypassSecret
      ? {
          "x-vercel-protection-bypass": bypassSecret,
          "x-vercel-set-bypass-cookie": "true",
        }
      : undefined,
  },
  projects: [
    {
      name: "public",
      testMatch: /public\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "logged-in",
      testMatch: /logged-in\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: AUTH_FILE },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
