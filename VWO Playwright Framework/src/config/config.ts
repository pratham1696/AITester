const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export const devConfig = {
  baseUrl: env.BASE_URL ?? 'http://127.0.0.1:3000',
};

export const stagingConfig = {
  baseUrl: env.STAGING_BASE_URL ?? 'https://staging.example.com',
};

export const prodConfig = {
  baseUrl: env.PROD_BASE_URL ?? 'https://example.com',
};

export const testEnvironment = env.TEST_ENV ?? 'dev';

export function getActiveConfig() {
  switch (testEnvironment) {
    case 'staging':
      return stagingConfig;
    case 'prod':
      return prodConfig;
    default:
      return devConfig;
  }
}
