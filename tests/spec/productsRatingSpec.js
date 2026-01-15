import { products } from '../../data/products.js';

describe('product ratings', () => {
  it('each product has ratingStars between 0 and 5', () => {
    products.forEach((product) => {
      expect(typeof product.ratingStars).toBe('number');
      expect(product.ratingStars).not.toBeLessThan(0);
      expect(product.ratingStars).not.toBeGreaterThan(5);
    });
  });

  it('each product has ratingCount >= 0', () => {
    products.forEach((product) => {
      expect(typeof product.ratingCount).toBe('number');
      expect(product.ratingCount).not.toBeLessThan(0);
    });
  });
});