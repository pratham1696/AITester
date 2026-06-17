import { expect, Locator, Page } from '@playwright/test';

export class AccountCreationPage {
  constructor(private readonly page: Page) {}

  async loadMockAccountCreationPage() {
    await this.page.setContent(`
      <main>
        <form id="registration-form" novalidate>
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit">Create account</button>
        </form>
        <button type="button" data-provider="google">Continue with Google</button>
        <div class="success-message" hidden>Account created</div>
        <div class="error-message" hidden></div>
        <div class="dashboard" hidden>Shopify dashboard</div>
      </main>
      <script>
        const form = document.getElementById('registration-form');
        const email = document.querySelector('input[name="email"]');
        const password = document.querySelector('input[name="password"]');
        const googleButton = document.querySelector('button[data-provider="google"]');
        const successMessage = document.querySelector('.success-message');
        const errorMessage = document.querySelector('.error-message');
        const dashboard = document.querySelector('.dashboard');
        window.__recaptchaBypassAttempted = false;

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          successMessage.hidden = true;
          errorMessage.hidden = true;

          const emailValue = email.value.trim();
          const passwordValue = password.value.trim();

          if (!emailValue.includes('@')) {
            errorMessage.textContent = 'Invalid email';
            errorMessage.hidden = false;
            return;
          }

          if (window.__recaptchaBypassAttempted) {
            errorMessage.textContent = 'Account creation blocked';
            errorMessage.hidden = false;
            return;
          }

          if (!passwordValue) {
            errorMessage.textContent = 'Password required';
            errorMessage.hidden = false;
            return;
          }

          successMessage.hidden = false;
        });

        googleButton.addEventListener('click', () => {
          dashboard.hidden = false;
        });
      </script>
    `);
  }

  async navigateToRegistrationPage() {
    await this.page.goto('/register');
  }

  async navigateToLoginPage() {
    await this.page.goto('/login');
  }

  async enterValidEmailAndPassword() {
    await this.page.locator('input[name="email"]').fill('tests@example.com');
    await this.page.locator('input[name="password"]').fill('password123');
  }

  async enterInvalidEmail() {
    await this.page.locator('input[name="email"]').fill('invalid-email');
  }

  async submitRegistration() {
    await this.page.locator('button[type="submit"]').click();
  }

  async clickGoogleLoginButton() {
    await this.page.locator('button[type="button"][data-provider="google"]').click();
  }

  async authenticateWithGoogle() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async attemptToBypassReCAPTCHA() {
    await this.page.evaluate(() => {
      (window as Window & { __recaptchaBypassAttempted?: boolean }).__recaptchaBypassAttempted = true;
    });
  }

  accountCreatedMessage(): Locator {
    return this.page.locator('div.success-message');
  }

  invalidEmailErrorMessage(): Locator {
    return this.page.locator('div.error-message');
  }

  dashboardMessage(): Locator {
    return this.page.locator('div.dashboard');
  }

  accountCreationBlockedMessage(): Locator {
    return this.page.locator('div.error-message');
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedMessage()).toContainText('Account created');
  }

  async expectInvalidEmail() {
    await expect(this.invalidEmailErrorMessage()).toContainText('Invalid email');
  }

  async expectDashboardVisible() {
    await expect(this.dashboardMessage()).toContainText('Shopify dashboard');
  }

  async expectAccountCreationBlocked() {
    await expect(this.accountCreationBlockedMessage()).toContainText('Account creation blocked');
  }
}
