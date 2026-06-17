import { test } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    const productCatalogPage = new ProductCatalogPage(page);
    await productCatalogPage.loadMockProductCatalogPage();
  });

  test('creates a product with variants', async ({ page }) => {
    const productCatalogPage = new ProductCatalogPage(page);
    await productCatalogPage.enterProductDetails();
    await productCatalogPage.addVariants();
    await productCatalogPage.submitProductForm();
    await productCatalogPage.expectProductSaved();
  });

  test('generates a luxury product description', async ({ page }) => {
    const productCatalogPage = new ProductCatalogPage(page);
    await productCatalogPage.generateAIDescription();
    await productCatalogPage.expectDescriptionContainsLuxury();
  });

  test('imports a CSV and shows product count', async ({ page }) => {
    const productCatalogPage = new ProductCatalogPage(page);
    await productCatalogPage.importCSVFile();
    await productCatalogPage.expectProductCountToContain950();
  });

  test('flags oversized image uploads', async ({ page }) => {
    const productCatalogPage = new ProductCatalogPage(page);
    await productCatalogPage.uploadLargeImageFile();
    await productCatalogPage.expectFileSizeLimitError();
  });
});