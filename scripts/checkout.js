import { products } from '../data/products.js';
import { getCartItems, calculateCartQuantity, removeFromCart } from '../data/cart.js';
import { formatMoney } from './utils/money.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);



function updateCartQuantity() {
  const el = $('.js-cart-quantity');
  if (!el) return;
  el.textContent = calculateCartQuantity();
}

function getProductById(productId) {
  return products.find(product => product.id === productId);
}

function renderSummary(subtotalCents) {
  const root = $('.js-checkout-summary');
  if (!root) return;

  root.innerHTML = `
    <div class="summary">
      <div class="summary-title">Order Summary</div>

      <div class="summary-row">
        <div>Subtotal</div>
        <div>$${formatMoney(subtotalCents)}</div>
      </div>

      <div class="summary-row summary-total">
        <div>Total</div>
        <div>$${formatMoney(subtotalCents)}</div>
      </div>
    </div>
  `;
}

function renderCheckout() {
  const root = $('.js-checkout');
  if (!root) return;

  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    root.innerHTML = `<p>Your cart is empty.</p>`;
    renderSummary(0);
    return;
  }

  let subtotalCents = 0;

  const html = cartItems.map((item) => {
    const product = getProductById(item.productId);
    const name = product ? product.name : '(Unknown product)';
    const priceCents = product ? product.priceCents : 0;
    const lineToTalCents = priceCents * item.quantity;
    subtotalCents += lineToTalCents
    return `
      <div class="cart-row">
        <div class="cart-row-name">${name}</div>
        <div class="cart-row-meta">
            $${formatMoney(priceCents)} • Qty: ${item.quantity} • Line: $${formatMoney(lineToTalCents)}
          </div>
        </div>

        <div>
          <button class="remove-button js-remove" data-product-id="${item.productId}">
            Remove
          </button>
        </div>

      </div>
    `;
  }).join('');

  root.innerHTML = html;
  renderSummary(subtotalCents);

  $$('.js-remove').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      removeFromCart(productId);
      renderCheckout();
      updateCartQuantity();
    });
  });
}

renderCheckout();
updateCartQuantity();