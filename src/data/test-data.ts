export interface PaymentDetails {
  name: string;
  email: string;
  receivePromotions?: boolean;
}

export interface Product {
  /** Value of the product's `data-test` attribute on the menu. */
  name: string;
  price: number;
}

export const PRODUCTS = {
  espresso: { name: 'Espresso', price: 10 },
  espressoMacchiato: { name: 'Espresso_Macchiato', price: 12 },
  cappuccino: { name: 'Cappuccino', price: 19 },
  mocha: { name: 'Mocha', price: 8 },
  flatWhite: { name: 'Flat_White', price: 18 },
  americano: { name: 'Americano', price: 7 },
  cafeLatte: { name: 'Cafe_Latte', price: 16 },
  espressoConPanna: { name: 'Espresso_Con Panna', price: 14 },
  cafeBreve: { name: 'Cafe_Breve', price: 15 },
} satisfies Record<string, Product>;

export const VALID_PAYMENT: PaymentDetails = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  receivePromotions: false,
};

export const PAYMENT_WITH_PROMO: PaymentDetails = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  receivePromotions: true,
};

/** Returns `count` products from the catalog, cycling if `count` exceeds its size. */
export function pickProducts(count: number): Product[] {
  const all = Object.values(PRODUCTS);
  return Array.from({ length: count }, (_, i) => all[i % all.length]);
}

export function expectedTotal(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.price, 0);
}
