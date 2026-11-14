/** Formats a price the way the app displays it, e.g. 19 -> "$19.00". */
export function formatPrice(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

/** Converts a `data-test` product name to the label the app displays, e.g. "Flat_White" -> "Flat White". */
export function displayName(productName: string): string {
  return productName.replaceAll('_', ' ');
}
