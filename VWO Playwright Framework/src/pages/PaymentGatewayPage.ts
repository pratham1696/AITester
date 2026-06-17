import { expect, Locator, Page } from '@playwright/test';

export class PaymentGatewayPage {
  constructor(private readonly page: Page) {}

  async loadMockPaymentGatewayPage() {
    await this.page.setContent(`
      <main>
        <button type="button" data-action="configure-shopify-payments">Configure Shopify Payments</button>
        <button type="button" data-action="upload-document">Upload expired ID</button>
        <button type="button" data-action="process-chargeback">Process chargeback</button>
        <input type="file" hidden />
        <div class="kyc-wizard" hidden>KYC wizard</div>
        <div class="document-status" hidden></div>
        <div class="fee-and-appeal-option" hidden></div>
      </main>
      <script>
        const kycWizard = document.querySelector('.kyc-wizard');
        const documentStatus = document.querySelector('.document-status');
        const feeAndAppealOption = document.querySelector('.fee-and-appeal-option');

        document.querySelector('button[data-action="configure-shopify-payments"]').addEventListener('click', () => {
          kycWizard.hidden = false;
        });

        document.querySelector('button[data-action="upload-document"]').addEventListener('click', () => {
          documentStatus.textContent = 'Rejected';
          documentStatus.hidden = false;
        });

        document.querySelector('button[data-action="process-chargeback"]').addEventListener('click', () => {
          feeAndAppealOption.textContent = '$15 appeal fee';
          feeAndAppealOption.hidden = false;
        });
      </script>
    `);
  }

  async navigateToPaymentPage() {
    await this.page.goto('/payment');
  }

  async configureShopifyPayments() {
    await this.page.locator('button[type="button"][data-action="configure-shopify-payments"]').click();
  }

  async uploadExpiredIDDocument() {
    await this.page.locator('button[type="button"][data-action="upload-document"]').click();
  }

  async processChargeback() {
    await this.page.locator('button[type="button"][data-action="process-chargeback"]').click();
  }

  kycWizardText(): Locator {
    return this.page.locator('div.kyc-wizard');
  }

  documentStatusText(): Locator {
    return this.page.locator('div.document-status');
  }

  feeAndAppealOptionText(): Locator {
    return this.page.locator('div.fee-and-appeal-option');
  }

  async expectKycWizardVisible() {
    await expect(this.kycWizardText()).toContainText('KYC wizard');
  }

  async expectRejectedDocumentStatus() {
    await expect(this.documentStatusText()).toContainText('Rejected');
  }

  async expectChargebackFee() {
    await expect(this.feeAndAppealOptionText()).toContainText('$15');
  }
}
