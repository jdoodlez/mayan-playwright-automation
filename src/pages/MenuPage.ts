import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class MenuPage extends BasePage {
  /** Nav link showing the item count, e.g. "cart (2)". */
  readonly cartLink: Locator;
  /** "Total: $X.XX" button that opens the payment form. */
  readonly checkoutButton: Locator;
  /** Shown whenever the cart count reaches a multiple of 3. */
  readonly promoPopup: Locator;
  readonly promoAcceptButton: Locator;
  readonly promoDeclineButton: Locator;
  /** Confirmation dialog opened by right-clicking a product. */
  readonly addToCartDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.cartLink = page.getByLabel('Cart page');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.promoPopup = page.locator('.promo');
    this.promoAcceptButton = this.promoPopup.getByRole('button', { name: /yes/i });
    this.promoDeclineButton = this.promoPopup.getByRole('button', { name: /nah/i });
    this.addToCartDialog = page.getByRole('dialog');
  }

  async open() {
    await this.goto('/');
  }

  getProductCard(productName: string): Locator {
    return this.page.locator(`[data-test="${productName}"]`);
  }

  /** The product's `h4` heading, which holds both its name and price. */
  getProductTitle(productName: string): Locator {
    return this.page
      .locator('li')
      .filter({ has: this.getProductCard(productName) })
      .locator('h4');
  }

  /** Adds one unit. Does not handle the promo popup. */
  async addToCart(productName: string) {
    await this.getProductCard(productName).click();
  }

  /** Adds products in order, accepting or declining each promo popup as it appears. */
  async addMultipleToCart(productNames: string[], acceptPromo = true) {
    let count = await this.getCartCount();
    for (const name of productNames) {
      await this.addToCart(name);
      count++;
      await expect(this.cartLink).toHaveText(`cart (${count})`);
      if (count % 3 === 0) {
        await this.handlePromoPopup(acceptPromo);
        if (acceptPromo) count++;
      }
    }
  }

  /** Waits for the promo popup, then accepts or declines it. Accepting adds a discounted item. */
  async handlePromoPopup(accept = true) {
    await expect(this.promoPopup).toBeVisible();
    await (accept ? this.promoAcceptButton : this.promoDeclineButton).click();
    await expect(this.promoPopup).toBeHidden();
  }

  async translateTitle(productName: string) {
    await this.getProductTitle(productName).dblclick();
  }

  async openAddToCartDialog(productName: string) {
    await this.getProductCard(productName).click({ button: 'right' });
    await expect(this.addToCartDialog).toBeVisible();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  /** Opens the cart via the nav link, keeping the in-memory cart intact. */
  async goToCart() {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    const match = (await this.textOf(this.cartLink)).match(/\((\d+)\)/);
    if (!match) throw new Error('Could not read cart count from the cart link');
    return Number(match[1]);
  }
}
