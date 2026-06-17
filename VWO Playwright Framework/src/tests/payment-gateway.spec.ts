import { test } from '@playwright/test';
import { PaymentGatewayPage } from '../pages/PaymentGatewayPage';

test.describe('Payment Gateway', () => {
  test.beforeEach(async ({ page }) => {
    const paymentGatewayPage = new PaymentGatewayPage(page);
    await paymentGatewayPage.loadMockPaymentGatewayPage();
  });

  test('opens the KYC wizard for Shopify Payments', async ({ page }) => {
    const paymentGatewayPage = new PaymentGatewayPage(page);
    await paymentGatewayPage.configureShopifyPayments();
    await paymentGatewayPage.expectKycWizardVisible();
  });

  test('rejects an expired ID document', async ({ page }) => {
    const paymentGatewayPage = new PaymentGatewayPage(page);
    await paymentGatewayPage.uploadExpiredIDDocument();
    await paymentGatewayPage.expectRejectedDocumentStatus();
  });

  test('shows the chargeback fee and appeal option', async ({ page }) => {
    const paymentGatewayPage = new PaymentGatewayPage(page);
    await paymentGatewayPage.processChargeback();
    await paymentGatewayPage.expectChargebackFee();
  });
});