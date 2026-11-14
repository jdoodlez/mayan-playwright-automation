import { test as base } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage.js';
import { CartPage } from '../pages/CartPage.js';
import { PaymentPage } from '../pages/PaymentPage.js';

type CoffeeCartFixtures = {
  /** Opens the menu before the test starts. */
  menuPage: MenuPage;
  cartPage: CartPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<CoffeeCartFixtures>({
  menuPage: async ({ page }, use) => {
    const menuPage = new MenuPage(page);
    await menuPage.open();
    await use(menuPage);
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
});

export { expect } from '@playwright/test';
