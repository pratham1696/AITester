import { test } from '@playwright/test';
import { AccountCreationPage } from '../pages/AccountCreationPage';

test.describe('Account Creation', () => {
  test.beforeEach(async ({ page }) => {
    const accountCreationPage = new AccountCreationPage(page);
    await accountCreationPage.loadMockAccountCreationPage();
  });

  test('creates an account with valid credentials', async ({ page }) => {
    const accountCreationPage = new AccountCreationPage(page);
    await accountCreationPage.enterValidEmailAndPassword();
    await accountCreationPage.submitRegistration();
    await accountCreationPage.expectAccountCreated();
  });

  test('shows an invalid email error', async ({ page }) => {
    const accountCreationPage = new AccountCreationPage(page);
    await accountCreationPage.enterInvalidEmail();
    await accountCreationPage.submitRegistration();
    await accountCreationPage.expectInvalidEmail();
  });

  test('reveals the dashboard after Google sign-in trigger', async ({ page }) => {
    const accountCreationPage = new AccountCreationPage(page);
    await accountCreationPage.clickGoogleLoginButton();
    await accountCreationPage.authenticateWithGoogle();
    await accountCreationPage.expectDashboardVisible();
  });

  test('blocks account creation after reCAPTCHA bypass attempt', async ({ page }) => {
    const accountCreationPage = new AccountCreationPage(page);
    await accountCreationPage.enterValidEmailAndPassword();
    await accountCreationPage.attemptToBypassReCAPTCHA();
    await accountCreationPage.submitRegistration();
    await accountCreationPage.expectAccountCreationBlocked();
  });
});