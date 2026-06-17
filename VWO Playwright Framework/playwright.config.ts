import { defineConfig } from '@playwright/test';

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const baseURL = env.BASE_URL ?? 'https://app.vwo.com';
const headless = env.HEADLESS !== 'false';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  retries: env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless,
    viewport: {
      width: 1280,
      height: 720,
    },
  },
  projects: [
    {
      name: 'chromium-dev',
      use: { browserName: 'chromium' },
    },
  ],
});
