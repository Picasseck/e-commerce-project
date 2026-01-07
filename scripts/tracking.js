import { calculateCartQuantity } from '../data/cart.js';
import { getOrders } from '../data/orders.js';
import { products } from '../data/products.js';
import { getProductById } from './utils/cartTotals.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

const $ = (sel) => document.querySelector(sel);

function updateCartQuantity() {
  const element = $('.js-cart-quantity');
  if (!element) return;
  element.textContent = calculateCartQuantity();
}

function formatDate(ms) {
  if (!ms) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric'
  }).format(new Date(ms));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getProgressPercent(nowMs, orderTimeMs, deliveryMs) {
  if (!orderTimeMs || !deliveryMs || deliveryMs <= orderTimeMs) return 0;
  const raw = ((nowMs - orderTimeMs) / (deliveryMs - orderTimeMs)) * 100;
  return clamp(raw, 0, 100);
}

function renderTracking() {
  const root = $('.js-tracking');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const productId = params.get('productId');

  if (!orderId || !productId) {
    root.innerHTML = `
      <div class="tracking-card">
        <h1 class="tracking-title">Tracking</h1>
        <p class="tracking-subtitle">Missing orderId or productId in URL.</p>
        <a class="back-link" href="orders.html">← Back to orders</a>
      </div>
    `;
    return;
  }

  const orders = getOrders();
  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    root.innerHTML = `
      <div class="tracking-card">
        <h1 class="tracking-title">Tracking</h1>
        <p class="tracking-subtitle">Order not found.</p>
        <a class="back-link" href="orders.html">← Back to orders</a>
      </div>
    `;
    return;
  }

  const item = (order.items || []).find((item) => item.productId === productId);

  if (!item) {
    root.innerHTML = `
      <div class="tracking-card">
        <h1 class="tracking-title">Tracking</h1>
        <p class="tracking-subtitle">Product not found in this order.</p>
        <a class="back-link" href="orders.html">← Back to orders</a>
      </div>
    `;
    return;
  }

  const product = getProductById(products, productId);
  const productName = product ? product.name : `(Unknown: ${productId})`;

  const orderTimeMs = order.orderTimeMs || Date.now();

  const selectedOptionId = item.deliveryOptionId || '1';
  const option = deliveryOptions.find((option) => option.id === selectedOptionId) || deliveryOptions[0];

  const estimatedDeliveryTimeMs = orderTimeMs + option.deliveryDays * 24 * 60 * 60 * 1000;

  const nowMs = Date.now();
  const percent = getProgressPercent(nowMs, orderTimeMs, estimatedDeliveryTimeMs);

  root.innerHTML = `
    <div class="tracking-card">
      <h1 class="tracking-title">Tracking</h1>
      <p class="tracking-subtitle">${productName}</p>

      <div class="tracking-meta">
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Order placed:</strong> ${formatDate(orderTimeMs)}</div>
        <div><strong>Estimated delivery:</strong> ${formatDate(estimatedDeliveryTimeMs)}</div>
        <div><strong>Quantity:</strong> ${item.quantity}</div>
      </div>

      <div class="progress">
        <div class="progress-steps">
          <span>Order placed</span>
          <span>Shipped</span>
          <span>Out for delivery</span>
          <span>Delivered</span>
        </div>

        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
      </div>

      <a class="back-link" href="orders.html">← Back to orders</a>
    </div>
  `;
}

renderTracking();
updateCartQuantity();