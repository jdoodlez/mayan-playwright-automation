import { test, expect } from '../src/fixtures/index.js';
import { PRODUCTS, VALID_PAYMENT, PAYMENT_WITH_PROMO, pickProducts, expectedTotal } from '../src/data/index.js';
import { formatPrice } from '../src/utils/helpers.js';

test.describe('Checkout', () => {
  test('completes a purchase with a single product', async ({ menuPage, paymentPage }) => {
    await menuPage.addToCart(PRODUCTS.espresso.name);
    await menuPage.goToCheckout();
    await paymentPage.completePayment(VALID_PAYMENT);
    await paymentPage.expectSuccess();
  });

  test('completes a purchase with multiple products', async ({ menuPage, paymentPage }) => {
    await menuPage.addMultipleToCart([PRODUCTS.cappuccino.name, PRODUCTS.mocha.name]);
    await menuPage.goToCheckout();
    await paymentPage.completePayment(VALID_PAYMENT);
    await paymentPage.expectSuccess();
  });

  test('completes a purchase after accepting the promo', async ({ menuPage, paymentPage }) => {
    await menuPage.addMultipleToCart([PRODUCTS.espresso.name, PRODUCTS.cappuccino.name, PRODUCTS.mocha.name], true);
    await menuPage.goToCheckout();
    await paymentPage.completePayment(PAYMENT_WITH_PROMO);
    await paymentPage.expectSuccess();
  });

  test('completes a purchase after declining the promo', async ({ menuPage, paymentPage }) => {
    await menuPage.addMultipleToCart([PRODUCTS.americano.name, PRODUCTS.flatWhite.name, PRODUCTS.cafeLatte.name], false);
    await menuPage.goToCheckout();
    await paymentPage.completePayment(VALID_PAYMENT);
    await paymentPage.expectSuccess();
  });

  test('completes a purchase with six products and every promo accepted', async ({ menuPage, paymentPage }) => {
    await menuPage.addMultipleToCart(pickProducts(6).map((p) => p.name), true);
    await menuPage.goToCheckout();
    await paymentPage.completePayment(VALID_PAYMENT);
    await paymentPage.expectSuccess();
  });

  test('shows a total matching the sum of added items', async ({ menuPage }) => {
    const items = [PRODUCTS.espresso, PRODUCTS.cappuccino];
    await menuPage.addMultipleToCart(items.map((p) => p.name));
    await expect(menuPage.checkoutButton).toContainText(formatPrice(expectedTotal(items)));
  });
});
