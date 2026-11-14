import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { displayName } from '../utils/helpers.js';

/** The `/cart` view. Reach it with `MenuPage.goToCart()`; `page.goto` would empty the cart. */
export class CartPage extends BasePage {
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyMessage = page.getByText('No coffee, go add some.');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  private removeAllButton(productName: string): Locator {
    return this.page.getByRole('button', { name: `Remove all ${displayName(productName)}`, exact: true });
  }

  getRow(productName: string): Locator {
    return this.page.locator('li.list-item').filter({ has: this.removeAllButton(productName) });
  }

  /** Unit price and quantity, e.g. "$10.00 x 2". */
  getUnitDescription(productName: string): Locator {
    return this.getRow(productName).locator('.unit-desc');
  }

  async removeAll(productName: string) {
    await this.removeAllButton(productName).click();
  }
}
