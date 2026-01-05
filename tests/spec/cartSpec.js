import {
  addToCart,
  calculateCartQuantity,
  getCartItems,
  removeFromCart,
  updateQuantity,
  clearCart
} from '../../data/cart.js';

describe('cart', () => {
  beforeEach(() => {
    localStorage.removeItem('cart');
    clearCart();
  });

  it('adds a new product to the cart', () => {
    addToCart('p1', 1);

    const items = getCartItems();
    expect(items.length).toBe(1);
    expect(items[0].productId).toBe('p1');
    expect(items[0].quantity).toBe(1);
  });

  it('increases quantity if product already exists', () => {
    addToCart('p1', 1);
    addToCart('p1', 2);

    const items = getCartItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });

  it('calculates total quantity', () => {
    addToCart('p1', 2);
    addToCart('p2', 3);

    expect(calculateCartQuantity()).toBe(5);
  });

  it('removes a product from the cart', () => {
    addToCart('p1', 1);
    addToCart('p2', 1);

    removeFromCart('p1');

    const items = getCartItems();
    expect(items.length).toBe(1);
    expect(items[0].productId).toBe('p2');
  });

  it('updates quantity of an existing product', () => {
    addToCart('p1', 1);

    updateQuantity('p1', 4);

    const items = getCartItems();
    expect(items[0].quantity).toBe(4);
  });

  it('removes product if updated quantity is 0 or less', () => {
    addToCart('p1', 2);

    updateQuantity('p1', 0);

    expect(getCartItems().length).toBe(0);
    expect(calculateCartQuantity()).toBe(0);
  });

  it('getCartItems returns a copy (no external mutation)', () => {
    addToCart('p1', 1);

    const items = getCartItems();
    items[0].quantity = 999;

    expect(calculateCartQuantity()).toBe(1);
  });

  it('saves cart in localStorage', () => {
    addToCart('p1', 2);

    const raw = localStorage.getItem('cart');
    expect(raw).not.toBeNull();

    const saved = JSON.parse(raw);
    expect(saved.length).toBe(1);
    expect(saved[0].productId).toBe('p1');
    expect(saved[0].quantity).toBe(2);
  });
});