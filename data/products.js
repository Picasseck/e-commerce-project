export let products = [];

export async function loadProductsFetch() {
  const url = new URL('./products.json', import.meta.url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load products.json (${response.status})`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('products.json must be an array');
  }

  products = data;
  return products;
}