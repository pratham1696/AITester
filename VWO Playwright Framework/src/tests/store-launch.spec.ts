import { test } from '@playwright/test';
import { StoreLaunchPage } from '../pages/StoreLaunchPage';

test.describe('Store Launch', () => {
  test.beforeEach(async ({ page }) => {
    const storeLaunchPage = new StoreLaunchPage(page);
    await storeLaunchPage.loadMockLaunchPage();
  });

  test('shows the launch button as disabled', async ({ page }) => {
    const storeLaunchPage = new StoreLaunchPage(page);
    await storeLaunchPage.expectLaunchButtonDisabled();
  });

  test('shows GDPR compliance text', async ({ page }) => {
    const storeLaunchPage = new StoreLaunchPage(page);
    await storeLaunchPage.expectGdprComplianceVisible();
  });

  test('triggers the launch animation', async ({ page }) => {
    const storeLaunchPage = new StoreLaunchPage(page);
    await storeLaunchPage.triggerLaunchAnimation();
    await storeLaunchPage.expectAnimationTriggers();
  });
});