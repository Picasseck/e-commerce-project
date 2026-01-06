import { calculateCartQuantity } from '../data/cart.js';
import { getOrders } from '../data/orders.js';
import { products } from '../data/products.js';
import { formatMoney } from './utils/money.js';
import { getProductById } from './utils/cartTotals.js';

const $ = (sel) => document.querySelector(sel);

function updateCartQuantity() {
  const el = $('.js-cart-quantity');
  if (!el) return;
  el.textContent = calculateCartQuantity();
}

function formatOrdersDate(ms) {
  if(!ms) return '';
  return new Intl.DateTimeFormat('fr-FR', {month: 'long', day: 'numeric' }).format(new Date(ms));
}

function renderOrders() {
  const root = $('.js-orders');
  if (!root) return;

  const orders = getOrders();

  if (orders.length === 0) {
    root.innerHTML = `<div class="orders-empty">No orders yet.</div>`;
    return;
  }

  root.innerHTML = orders.map((order) => {
    const dateString = formatOrdersDate(order.orderTimeMs);
    const totalCents = order.totalCents ?? 0;

    const itemsHTML = (order.items || []).map((item) => {
      const product = getProductById(products, item.productId);
      const name = product ? product.name : `(Unknown: ${item.productId})`;
      return `
        <div class="order-item">
          <div class="order-item-name">${name}</div>
          <div class="order-item-qty">Qty: ${item.quantity}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div><strong>Order placed:</strong> ${dateString}</div>
          <div><strong>Total:</strong> $${formatMoney(totalCents)}</div>
          <div class="order-id"><strong>ID:</strong> ${order.id}</div>
        </div>

        <div class="order-items">
          ${itemsHTML}
        </div>
      </div>
    `;
  }).join('');
}

renderOrders();
updateCartQuantity();