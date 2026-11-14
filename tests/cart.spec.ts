import { test, expect } from '../src/fixtures/index.js';
import { PRODUCTS } from '../src/data/index.js';

test.describe('Cart', () => {
  test('is empty initially', async ({ menuPage, cartPage }) => {
    await menuPage.goToCart();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test('lists an added product', async ({ menuPage, cartPage }) => {
    await menuPage.addToCart(PRODUCTS.cappuccino.name);
    await menuPage.goToCart();
    await expect(cartPage.getRow(PRODUCTS.cappuccino.name)).toBeVisible();
  });

  test('increments quantity when the same product is added twice', async ({ menuPage, cartPage }) => {
    await menuPage.addToCart(PRODUCTS.espresso.name);
    await menuPage.addToCart(PRODUCTS.espresso.name);
    await menuPage.goToCart();
    await expect(cartPage.getUnitDescription(PRODUCTS.espresso.name)).toHaveText('$10.00 x 2');
  });

  test('removes an item', async ({ menuPage, cartPage }) => {
    await menuPage.addToCart(PRODUCTS.mocha.name);
    await menuPage.goToCart();
    await cartPage.removeAll(PRODUCTS.mocha.name);
    await expect(cartPage.emptyMessage).toBeVisible();
  });
});
