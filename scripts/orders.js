import { calculateCartQuantity } from '../data/cart.js';
import { getOrders } from '../data/orders.js';

const $ = (sel) => document.querySelector(sel);

function updateCartQuantity() {
  const el = $('.js-cart-quantity');
  if (!el) return;
  el.textContent = calculateCartQuantity();
}

function renderOrders() {
  const root = $('.js-orders');
  if (!root) return;

  const orders = getOrders();

  if (orders.length === 0) {
    root.innerHTML = `<div class="orders-empty">No orders yet.</div>`;
    return;
  }

  root.innerHTML = `<div class="orders-empty">Orders loaded: ${orders.length}</div>`;
}

renderOrders();
updateCartQuantity();