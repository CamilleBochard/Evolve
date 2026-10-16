import { defineConfig, devices } from '@playwright/test';

// Browser tests, run against the site served by the Docker image: only a real
// browser enforces the Content Security Policy, and only the image has the
// nginx headers.
//   docker run --detach --publish 8080:8080 evolve:ci
//   npm run test:e2e
// E2E_BASE_URL points the tests at another server.
const DEFAULT_BASE_URL = 'http://127.0.0.1:8080';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? DEFAULT_BASE_URL,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
