import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import type { PaymentDetails } from '../data/test-data.js';

/** The payment form modal opened by the checkout button. */
export class PaymentPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly promotionCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.promotionCheckbox = page.getByRole('checkbox', { name: 'Promotion checkbox' });
    this.submitButton = page.getByRole('button', { name: /submit/i });
    this.successMessage = page.locator('.snackbar');
  }

  async fillPaymentDetails(details: PaymentDetails) {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    if (details.receivePromotions) {
      await this.promotionCheckbox.check();
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async completePayment(details: PaymentDetails) {
    await this.fillPaymentDetails(details);
    await this.submit();
  }

  async expectSuccess(expectedText = 'Thanks for your purchase') {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(expectedText);
  }
}
