import { test, expect } from '../src/fixtures/index.js';
import { PRODUCTS } from '../src/data/index.js';
import { displayName, formatPrice } from '../src/utils/helpers.js';

test.describe('Menu', () => {
  test('has the Coffee Cart title', async ({ menuPage, page }) => {
    await expect(page).toHaveTitle(/Coffee Cart/i);
  });

  for (const product of Object.values(PRODUCTS)) {
    test(`shows ${displayName(product.name)} with its price`, async ({ menuPage }) => {
      await expect(menuPage.getProductCard(product.name)).toBeVisible();
      const title = menuPage.getProductTitle(product.name);
      await expect(title).toContainText(displayName(product.name));
      await expect(title).toContainText(formatPrice(product.price));
    });
  }
});
