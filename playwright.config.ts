import { defineConfig, devices } from '@playwright/test'

const puerto = 4173
const urlBase = `http://127.0.0.1:${puerto}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: urlBase,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -w @calculolibreperu/web -- --host 127.0.0.1 --port ${puerto}`,
    url: urlBase,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
