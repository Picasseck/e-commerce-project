import {
  getProductById,
  calculateLineTotalCents,
  calculateSubtotalCents
} from '../../scripts/utils/cartTotals.js';

describe('cartTotals', () => {
  const products = [
    { id: 'p1', name: 'Black Socks', priceCents: 1090 },
    { id: 'p2', name: 'Basketball', priceCents: 2095 },
    { id: 'p3', name: 'T-Shirt Pack', priceCents: 799 }
  ];

  describe('getProductById', () => {
    it('returns the matching product', () => {
      const product = getProductById(products, 'p2');
      expect(product).not.toBeNull();
      expect(product.id).toBe('p2');
      expect(product.priceCents).toBe(2095);
    });

    it('returns null when product does not exist', () => {
      const product = getProductById(products, 'does-not-exist');
      expect(product).toBeNull();
    });
  });

  describe('calculateLineTotalCents', () => {
    it('multiplies price by quantity', () => {
      expect(calculateLineTotalCents(500, 3)).toBe(1500);
    });

    it('returns 0 when quantity is 0', () => {
      expect(calculateLineTotalCents(999, 0)).toBe(0);
    });
  });

  describe('calculateSubtotalCents', () => {
    it('returns 0 for empty cart', () => {
      expect(calculateSubtotalCents([], products)).toBe(0);
    });

    it('sums multiple cart items', () => {
      const cartItems = [
        { productId: 'p1', quantity: 2 }, 
        { productId: 'p3', quantity: 1 } 
      ];
      expect(calculateSubtotalCents(cartItems, products)).toBe(2979);
    });

    it('ignores unknown productId', () => {
      const cartItems = [
        { productId: 'unknown', quantity: 10 }, 
        { productId: 'p2', quantity: 1 }
      ];
      expect(calculateSubtotalCents(cartItems, products)).toBe(2095);
    });

    it('works even if products list is empty', () => {
      const cartItems = [{ productId: 'p1', quantity: 2 }];
      expect(calculateSubtotalCents(cartItems, [])).toBe(0);
    });
  });
});