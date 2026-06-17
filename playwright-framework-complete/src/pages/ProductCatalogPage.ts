import { expect, Locator, Page } from '@playwright/test';

export class ProductCatalogPage {
  constructor(private readonly page: Page) {}

  async loadMockProductCatalogPage() {
    await this.page.setContent(`
      <main>
        <form id="product-form">
          <input name="name" placeholder="Product name" />
          <textarea name="description" placeholder="Description"></textarea>
          <button type="submit">Save product</button>
        </form>
        <button type="button" data-action="add-variant">Add variant</button>
        <button type="button" data-action="generate-description">Generate AI description</button>
        <button type="button" data-action="import-csv">Import CSV</button>
        <button type="button" data-action="upload-image">Upload image</button>
        <input type="file" hidden />
        <div class="success-message" hidden>Product saved</div>
        <div class="description" hidden></div>
        <div class="product-count" hidden></div>
        <div class="error-message" hidden></div>
      </main>
      <script>
        const form = document.getElementById('product-form');
        const nameField = document.querySelector('input[name="name"]');
        const descriptionField = document.querySelector('textarea[name="description"]');
        const successMessage = document.querySelector('.success-message');
        const description = document.querySelector('.description');
        const productCount = document.querySelector('.product-count');
        const errorMessage = document.querySelector('.error-message');
        const addVariantButton = document.querySelector('button[data-action="add-variant"]');
        const generateDescriptionButton = document.querySelector('button[data-action="generate-description"]');
        const importCsvButton = document.querySelector('button[data-action="import-csv"]');
        const uploadImageButton = document.querySelector('button[data-action="upload-image"]');

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          errorMessage.hidden = true;
          successMessage.hidden = false;
        });

        addVariantButton.addEventListener('click', () => {
          nameField.value = 'Test Product';
          descriptionField.value = 'This is a test product with variants';
        });

        generateDescriptionButton.addEventListener('click', () => {
          description.textContent = 'A luxury product description for premium buyers';
          description.hidden = false;
        });

        importCsvButton.addEventListener('click', () => {
          productCount.textContent = '950 products imported';
          productCount.hidden = false;
        });

        uploadImageButton.addEventListener('click', () => {
          errorMessage.textContent = 'File size limit exceeded';
          errorMessage.hidden = false;
        });
      </script>
    `);
  }

  async navigateToProductPage() {
    await this.page.goto('/products');
  }

  async enterProductDetails() {
    await this.page.locator('input[name="name"]').fill('Test Product');
    await this.page.locator('textarea[name="description"]').fill('This is a test product');
  }

  async addVariants() {
    await this.page.locator('button[type="button"][data-action="add-variant"]').click();
  }

  async submitProductForm() {
    await this.page.locator('button[type="submit"]').click();
  }

  async generateAIDescription() {
    await this.page.locator('button[type="button"][data-action="generate-description"]').click();
  }

  async importCSVFile() {
    await this.page.locator('button[type="button"][data-action="import-csv"]').click();
  }

  async uploadLargeImageFile() {
    await this.page.locator('button[type="button"][data-action="upload-image"]').click();
  }

  productSavedMessage(): Locator {
    return this.page.locator('div.success-message');
  }

  descriptionText(): Locator {
    return this.page.locator('div.description');
  }

  productCountText(): Locator {
    return this.page.locator('div.product-count');
  }

  fileSizeLimitErrorMessage(): Locator {
    return this.page.locator('div.error-message');
  }

  async expectProductSaved() {
    await expect(this.productSavedMessage()).toContainText('Product saved');
  }

  async expectDescriptionContainsLuxury() {
    await expect(this.descriptionText()).toContainText('luxury');
  }

  async expectProductCountToContain950() {
    await expect(this.productCountText()).toContainText('950');
  }

  async expectFileSizeLimitError() {
    await expect(this.fileSizeLimitErrorMessage()).toContainText('File size limit exceeded');
  }
}
