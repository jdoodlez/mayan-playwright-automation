import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigates relative to `baseURL`. This reloads the app, which clears the in-memory cart. */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  protected async textOf(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }
}
