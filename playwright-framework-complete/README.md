# VWO Login Playwright Suite

A Playwright suite focused on the VWO/Wingify login page at `https://app.vwo.com/#/login`.

## What is included

- A dedicated page object for the VWO login flow
- Mock-backed page objects and specs for account creation, product catalog, payment gateway, and store launch
- Tests for login form rendering, invalid login handling, password visibility toggling, and the five-page coverage below
- Playwright configuration with `BASE_URL` defaulting to `https://app.vwo.com`

## Test Coverage

- `Account Creation` - valid signup, invalid email, Google trigger, reCAPTCHA block
- `Product Catalog` - create product, AI description, CSV import, oversized image handling
- `Payment Gateway` - Shopify Payments KYC, expired ID rejection, chargeback fee
- `Store Launch` - disabled launch button, GDPR compliance, launch animation trigger
- `VWO Login` - login form rendering, invalid login error, password visibility toggle

## Spec Summary

| Spec file | Test count |
| --- | ---: |
| [src/tests/account-creation.spec.ts](src/tests/account-creation.spec.ts) | 4 |
| [src/tests/product-catalog.spec.ts](src/tests/product-catalog.spec.ts) | 4 |
| [src/tests/payment-gateway.spec.ts](src/tests/payment-gateway.spec.ts) | 3 |
| [src/tests/store-launch.spec.ts](src/tests/store-launch.spec.ts) | 3 |
| [src/tests/vwo-tests.spec.ts](src/tests/vwo-tests.spec.ts) | 3 |
| Total | 17 |

## Page Map

| Page object | Related spec |
| --- | --- |
| [src/pages/AccountCreationPage.ts](src/pages/AccountCreationPage.ts) | [src/tests/account-creation.spec.ts](src/tests/account-creation.spec.ts) |
| [src/pages/ProductCatalogPage.ts](src/pages/ProductCatalogPage.ts) | [src/tests/product-catalog.spec.ts](src/tests/product-catalog.spec.ts) |
| [src/pages/PaymentGatewayPage.ts](src/pages/PaymentGatewayPage.ts) | [src/tests/payment-gateway.spec.ts](src/tests/payment-gateway.spec.ts) |
| [src/pages/StoreLaunchPage.ts](src/pages/StoreLaunchPage.ts) | [src/tests/store-launch.spec.ts](src/tests/store-launch.spec.ts) |
| [src/pages/VwoLoginPage.ts](src/pages/VwoLoginPage.ts) | [src/tests/vwo-tests.spec.ts](src/tests/vwo-tests.spec.ts) |

## Folder Structure

```text
playwright-framework-complete/
  package.json
  playwright.config.ts
  tsconfig.json
  src/
    pages/
    tests/
    config/
    testData/
    utils/
```

## Setup

Install dependencies:

```bash
npm install
npx playwright install
```

## Run Tests

Run the suite:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Open the HTML report:

```bash
npm run report
```

## Notes

The suite defaults to the VWO login page. Override the target with `BASE_URL` if needed, for example:

```bash
$env:BASE_URL='https://app.vwo.com'
npm test
```
