import { products } from '../data/products.js';
import { getCartItems, calculateCartQuantity } from '../data/cart.js';

const $ = (sel) => document.querySelector(sel);

function updateCartQuantity() {
  const el = $('.js-cart-quantity');
  if (!el) return;
  el.textContent = calculateCartQuantity();
}

function getProductById(productId) {
  return products.find(product => product.id === productId);
}

function renderCheckout() {
  const root = $('.js-cart');
  if (!root) return;

  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    root.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  const html = cartItems.map((item) => {
    const product = getProductById(item.productId);
    const name = product ? product.name : '(Unknown product)';
    return `
      <div class="cart-row">
        <div class="cart-row-name">${name}</div>
        <div class="cart-row-qty">Qty: ${item.quantity}</div>
      </div>
    `;
  }).join('');

  root.innerHTML = html;
}

renderCheckout();
updateCartQuantity();