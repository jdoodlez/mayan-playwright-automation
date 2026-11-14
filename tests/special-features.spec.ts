import { test, expect } from '../src/fixtures/index.js';
import { PRODUCTS, CHINESE_TRANSLATIONS, expectedTotal } from '../src/data/index.js';
import { formatPrice } from '../src/utils/helpers.js';

test.describe('Double-click translation', () => {
  for (const product of Object.values(PRODUCTS)) {
    test(`translates ${product.name} to Chinese`, async ({ menuPage }) => {
      await menuPage.translateTitle(product.name);
      await expect(menuPage.getProductTitle(product.name)).toContainText(CHINESE_TRANSLATIONS[product.name]);
    });
  }
});

test.describe('Right-click add-to-cart dialog', () => {
  test('adds the product when confirmed', async ({ menuPage }) => {
    await menuPage.openAddToCartDialog(PRODUCTS.mocha.name);
    await expect(menuPage.addToCartDialog).toContainText('Add Mocha to the cart?');
    await menuPage.addToCartDialog.getByRole('button', { name: 'Yes' }).click();
    await expect(menuPage.cartLink).toHaveText('cart (1)');
  });

  test('does not add the product when cancelled', async ({ menuPage }) => {
    await menuPage.openAddToCartDialog(PRODUCTS.mocha.name);
    await menuPage.addToCartDialog.getByRole('button', { name: 'No' }).click();
    await expect(menuPage.addToCartDialog).toBeHidden();
    await expect(menuPage.cartLink).toHaveText('cart (0)');
  });
});

test.describe('Promo popup', () => {
  test('appears only once the cart reaches 3 items', async ({ menuPage }) => {
    await menuPage.addToCart(PRODUCTS.espresso.name);
    await menuPage.addToCart(PRODUCTS.cappuccino.name);
    await expect(menuPage.cartLink).toHaveText('cart (2)');
    await expect(menuPage.promoPopup).toBeHidden();

    await menuPage.addToCart(PRODUCTS.mocha.name);
    await expect(menuPage.promoPopup).toBeVisible();
  });

  test('appears again at 6 items', async ({ menuPage }) => {
    await menuPage.addMultipleToCart(
      [PRODUCTS.espresso, PRODUCTS.cappuccino, PRODUCTS.mocha, PRODUCTS.americano, PRODUCTS.flatWhite].map((p) => p.name),
      false,
    );
    await expect(menuPage.promoPopup).toBeHidden();

    await menuPage.addToCart(PRODUCTS.cafeLatte.name);
    await expect(menuPage.promoPopup).toBeVisible();
  });

  test('adds a discounted item when accepted', async ({ menuPage }) => {
    await menuPage.addMultipleToCart([PRODUCTS.espresso, PRODUCTS.cappuccino].map((p) => p.name));
    await menuPage.addToCart(PRODUCTS.mocha.name);
    await menuPage.handlePromoPopup(true);
    await expect(menuPage.cartLink).toHaveText('cart (4)');
  });

  test('adds nothing when declined', async ({ menuPage }) => {
    const items = [PRODUCTS.espresso, PRODUCTS.cappuccino, PRODUCTS.mocha];
    await menuPage.addMultipleToCart(items.map((p) => p.name), false);
    await expect(menuPage.cartLink).toHaveText('cart (3)');
    await expect(menuPage.checkoutButton).toContainText(formatPrice(expectedTotal(items)));
  });
});
