import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

if (existsSync(".env.e2e.local")) {
  process.loadEnvFile(".env.e2e.local");
}

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export const AUTH_FILE = "e2e/.auth/user.json";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
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
        command: process.env.CI ? "npm run start" : "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
