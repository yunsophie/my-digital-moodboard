import { defineConfig } from "@playwright/test";

const basePath = (process.env["GITHUB_PAGES_BASE_PATH"] ?? "/my-digital-moodboard").replace(
  /^\/+|\/+$/g,
  "",
);
const baseURL = `http://127.0.0.1:4173/${basePath ? `${basePath}/` : ""}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: 0,
  workers: 2,
  timeout: 60_000,
  globalTimeout: 180_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "phone",
      // Match the baseline's density so responsive selection is exercised.
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 1.75,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "tablet",
      use: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, hasTouch: true },
    },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run preview:pages",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
