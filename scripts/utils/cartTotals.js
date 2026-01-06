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

export function calculateTaxCents(subtotalCents, taxRate = 0.1) {
  return Math.round(subtotalCents * taxRate);
}

export function calculateShippingCents(subtotalCents, freeShippingThresholdCents = 3500, shippingCents = 499) {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= freeShippingThresholdCents ? 0 : shippingCents;
}

export function calculateTotalCents(subtotalCents, shippingCents, taxCents) {
  return subtotalCents + shippingCents + taxCents;
}