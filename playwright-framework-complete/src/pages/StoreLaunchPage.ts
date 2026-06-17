import { expect, Locator, Page } from '@playwright/test';

export class StoreLaunchPage {
  constructor(private readonly page: Page) {}

  async loadMockLaunchPage() {
    await this.page.setContent(`
      <main>
        <button type="button" disabled>Launch button disabled</button>
        <div class="gdpr-compliance">GDPR compliance</div>
        <button type="button" id="launch-store">Launch store</button>
        <div class="animation-trigger" hidden>Animation triggers</div>
      </main>
      <script>
        document.getElementById('launch-store').addEventListener('click', () => {
          document.querySelector('.animation-trigger').hidden = false;
        });
      </script>
    `);
  }

  async navigateToLaunchPage() {
    await this.page.goto('/launch');
  }

  async navigateToLaunchedStore() {
    await this.page.goto('/launched-store');
  }

  async triggerLaunchAnimation() {
    await this.page.locator('#launch-store').click();
  }

  launchButtonDisabled(): Locator {
    return this.page.locator('button[type="button"][disabled]');
  }

  gdprComplianceText(): Locator {
    return this.page.locator('div.gdpr-compliance');
  }

  animationTriggerText(): Locator {
    return this.page.locator('div.animation-trigger');
  }

  async expectLaunchButtonDisabled() {
    await expect(this.launchButtonDisabled()).toContainText('Launch button disabled');
  }

  async expectGdprComplianceVisible() {
    await expect(this.gdprComplianceText()).toContainText('GDPR compliance');
  }

  async expectAnimationTriggers() {
    await expect(this.animationTriggerText()).toContainText('Animation triggers');
  }
}
