# Mayan Playwright Automation

Playwright end-to-end tests for [coffee-cart.app](https://coffee-cart.app/).

## Setup

Requires Node.js 20+.

```bash
npm install
npx playwright install --with-deps
```

## Running tests

```bash
npm test                              # all browsers
npx playwright test --project=chromium
npx playwright test checkout          # one spec file
npm run test:ui                       # interactive UI mode
npm run test:report                   # open the last HTML report
npm run typecheck
```

## Layout

- `src/pages/` – page objects (`MenuPage`, `CartPage`, `PaymentPage`)
- `src/fixtures/` – extends Playwright's `test` with those page objects; `menuPage` opens the menu before each test
- `src/data/` – product catalog, payment details, Chinese title translations
- `src/utils/` – price and product-name formatting
- `tests/` – specs for the menu, cart, checkout, and the app's special interactions (double-click translation, right-click dialog, promo popup)

## Things to know about the app

- The cart lives in memory. `page.goto()` reloads the app and empties it, so navigate to the cart with `menuPage.goToCart()`.
- The promo popup appears whenever the cart count reaches a multiple of 3. Accepting it adds a discounted item, which shifts when the next popup appears. `menuPage.addMultipleToCart()` accounts for this.
- Product `data-test` names use underscores (`Flat_White`); the UI shows spaces. Use `displayName()` to convert.
