export function normalizeSearch(text) {
  return (text ?? '').toString().trim().toLowerCase();
}

export function filterProducts(products, rawText) {
  const searchText = normalizeSearch(rawText);
  if (!searchText) return products;

  return products.filter((product) =>
    (product.name ?? '').toString().toLowerCase().includes(searchText)
  );
}