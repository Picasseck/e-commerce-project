import { calculateCartQuantity, addToCart } from '../data/cart.js';
import { getOrders } from '../data/orders.js';
import { products, loadProductsFetch } from '../data/products.js';
import { formatMoney } from './utils/money.js';
import { getProductById, calculateLineTotalCents } from './utils/cartTotals.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { formatOrdersDate, getDeliveryText } from './utils/ordersUtils.js';
import { setupHeaderSearchRedirect } from './utils/headerSearch.js';

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

  root.innerHTML = orders.map((order) => {
    const dateString = formatOrdersDate(order.orderTimeMs);
    const totalCents = order.totalCents ?? 0;

    const itemsHTML = (order.items || []).map((item) => {
      const product = getProductById(products, item.productId);
      const name = product ? product.name : `(Unknown: ${item.productId})`;
      const deliveryText = getDeliveryText(order.orderTimeMs, item.deliveryOptionId, deliveryOptions);

      const priceCents = product ? product.priceCents : 0;
      const lineTotalCents = calculateLineTotalCents(priceCents, item.quantity);
      return `
      <div class="order-item">
          <img class="order-item-image" src="${product?.images || ''}" alt="${name}">
        <div class="order-item-content"> 
          <div class="order-item-name">${name}</div>
          <div class="order-item-meta">Qty: ${item.quantity} • Price: $${formatMoney(priceCents)} • Line total: $${formatMoney(lineTotalCents)}</div>
          <div class="order-item-delivery">${deliveryText}</div>
        </div> 

        <div class="order-item-actions">     
            <button class="buy-again-button js-buy-again" data-product-id="${item.productId}">
              Buy it again
            </button>

            <a class="track-link"
              href="tracking.html?orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(item.productId)}">
              Track package
            </a>
        </div>  
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

  root.querySelectorAll('.js-buy-again').forEach((btn) => {
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;

    addToCart(productId, 1);
    updateCartQuantity(); 
    
    const oldText = btn.textContent;
    btn.textContent = 'Added';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = oldText;
      btn.disabled = false;
    }, 1000);
  });
});
}


async function main() {
  try {
    await loadProductsFetch();
renderOrders();
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