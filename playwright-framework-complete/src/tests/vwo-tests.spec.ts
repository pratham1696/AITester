import { test } from '@playwright/test';
import { VwoLoginPage } from '../pages/VwoLoginPage';

test.describe('VWO Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
  });

  test('renders the Wingify login form', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await loginPage.expectLoginFormVisible();
    await loginPage.expectAlternateSignInOptionsVisible();
  });

  test('shows an authentication error for invalid credentials', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await loginPage.loginWithCredentials('invalid@example.com', 'wrong-password');
    await loginPage.expectInvalidLoginError();
  });

  test('toggles password visibility', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await loginPage.expectPasswordFieldType('password');
    await loginPage.togglePasswordVisibility();
    await loginPage.expectPasswordFieldType('text');
  });
});
