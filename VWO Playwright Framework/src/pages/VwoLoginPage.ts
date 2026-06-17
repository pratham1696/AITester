import { expect, Locator, Page } from '@playwright/test';

export class VwoLoginPage {
  constructor(private readonly page: Page) {}

  emailField(): Locator {
    return this.page.locator('#login-username');
  }

  passwordField(): Locator {
    return this.page.locator('#login-password');
  }

  signInButton(): Locator {
    return this.page.locator('#js-login-btn');
  }

  forgotPasswordButton(): Locator {
    return this.page.getByRole('button', { name: 'Forgot Password?' });
  }

  googleSignInButton(): Locator {
    return this.page.locator('#js-google-signin-btn');
  }

  ssoSignInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign in using SSO' });
  }

  passkeySignInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign in with Passkey' });
  }

  passwordVisibilityToggle(): Locator {
    return this.page.getByRole('button', { name: 'Toggle password visibility' }).first();
  }

  loginErrorMessage(): Locator {
    return this.page.getByText('Your email, password, IP address or location did not match');
  }

  async loginWithCredentials(email: string, password: string) {
    await this.emailField().fill(email);
    await this.passwordField().fill(password);
    await this.signInButton().click();
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggle().click();
  }

  async expectLoginFormVisible() {
    await expect(this.emailField()).toBeVisible();
    await expect(this.passwordField()).toBeVisible();
    await expect(this.signInButton()).toBeVisible();
  }

  async expectAlternateSignInOptionsVisible() {
    await expect(this.forgotPasswordButton()).toBeVisible();
    await expect(this.googleSignInButton()).toBeVisible();
    await expect(this.ssoSignInButton()).toBeVisible();
    await expect(this.passkeySignInButton()).toBeVisible();
  }

  async expectInvalidLoginError() {
    await expect(this.loginErrorMessage()).toBeVisible();
  }

  async expectPasswordFieldType(type: 'password' | 'text') {
    await expect(this.passwordField()).toHaveAttribute('type', type);
  }
}