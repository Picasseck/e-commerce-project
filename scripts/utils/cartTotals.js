export function getProductById(products, productId) {
  return products.find((product) => product.id === productId) || null;
}

export function calculateLineTotalCents(priceCents, quantity) {
  return priceCents * quantity;
}

export function calculateSubtotalCents(cartItems, products) {
  let subtotalCents = 0;

  cartItems.forEach((item) => {
    const product = getProductById(products, item.productId);
    if (!product) return;

    subtotalCents += calculateLineTotalCents(product.priceCents, item.quantity);
  });

  return subtotalCents;
}