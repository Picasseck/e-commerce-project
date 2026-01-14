import { calculateCartQuantity } from '../data/cart.js';
import { getOrders } from '../data/orders.js';
import { products, loadProductsFetch } from '../data/products.js';
import { getProductById } from './utils/cartTotals.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { getProgressPercent, getStepIndex } from './utils/trackingUtils.js';
import { formatOrdersDate, getDeliveryDateMs } from './utils/ordersUtils.js';
import { setupHeaderSearchRedirect } from './utils/headerSearch.js';

const $ = (sel) => document.querySelector(sel);

function updateCartQuantity() {
  const element = $('.js-cart-quantity');
  if (!element) return;
  element.textContent = calculateCartQuantity();
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
  const estimatedDeliveryTimeMs = getDeliveryDateMs(orderTimeMs, item.deliveryOptionId, deliveryOptions);

  const nowMs = Date.now();
  const percent = getProgressPercent(nowMs, orderTimeMs, estimatedDeliveryTimeMs);
  const stepIndex = getStepIndex(percent);

  function stepClass(i) {
    if(i < stepIndex) return 'is-done';
    if(i === stepIndex) return 'is-current';
    return '';
  }

  root.innerHTML = `
    <div class="tracking-card">
      <h1 class="tracking-title">Tracking</h1>
      <p class="tracking-subtitle">${productName}</p>

      <div class="tracking-meta">
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Order placed:</strong> ${formatOrdersDate(orderTimeMs)}</div>
        <div><strong>Estimated delivery:</strong> ${formatOrdersDate(estimatedDeliveryTimeMs)}</div>
        <div><strong>Quantity:</strong> ${item.quantity}</div>
      </div>

      <div class="progress">
        <div class="progress-steps">
          <span class="${stepClass(0)}">Order placed</span>
          <span class="${stepClass(1)}">Shipped</span>
          <span class="${stepClass(2)}">Out for delivery</span>
          <span class="${stepClass(3)}">Delivered</span>
        </div>

        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
      </div>

      <a class="back-link" href="orders.html">← Back to orders</a>
    </div>
  `;
}

async function main() {
  try {
    await loadProductsFetch();
renderTracking();
updateCartQuantity();
setupHeaderSearchRedirect();
} catch (error) {
    console.error(error);
    const root = $('.js-orders');
    if (root) root.innerHTML = `<p>Unable to load products. Use Live Server and refresh.</p>`;
    updateCartQuantity();
  }
}

main();
