const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./playwright",
  use: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    headless: true,
  },
  reporter: [["list"]],
  timeout: 20_000,

  // Start Next.js dev server automatically for tests
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000
  }
});
