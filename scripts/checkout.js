import { products } from '../data/products.js';
import { getCartItems, calculateCartQuantity, removeFromCart, updateQuantity } from '../data/cart.js';
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

  const html = cartItems.map((cartItem) => {
    const product = getProductById(cartItem.productId);
    const name = product ? product.name : '(Unknown product)';
    const priceCents = product ? product.priceCents : 0;
    const lineToTalCents = priceCents * cartItem.quantity;
    subtotalCents += lineToTalCents
    return `
      <div class="cart-row">
        <div class="cart-row-name">${name}</div>
        <div class="cart-row-meta">
            $${formatMoney(priceCents)} • Qty: <span class="js-qty-label">${cartItem.quantity}</span> • Line: $${formatMoney(lineToTalCents)}
        </div>

        <div class="cart-row-meta">
          <button class="remove-button js-update" data-product-id="${cartItem.productId}">
            Update
          </button>

          <input class="qty-input js-qty-input" type="number" min="1" value="${cartItem.quantity}" />

          <button class="remove-button js-save" data-product-id="${cartItem.productId}">
            Save
          </button>
        </div>

        <div>
          <button class="remove-button js-remove" data-product-id="${cartItem.productId}">
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

  $$('.js-update').forEach((btn) => {
  btn.addEventListener('click', () => {
    const row = btn.closest('.cart-row');
    row.classList.add('is-editing');

    const input = row.querySelector('.js-qty-input');
     const label = row.querySelector('.js-qty-input');

    let startQty = parseInt(label.value, 10);
    if (Number.isNaN(startQty) || startQty < 1) startQty = 1;
    input.focus();
    input.select();

    input.addEventListener('keydown', event => {
      if(event.key === 'Enter'){
        row.querySelector('.js-save')?.click();
      }

      if(event.key === 'Escape'){
        input.value = startQty;
        row.classList.remove('is-editing');
      }

    })
  });
});

$$('.js-save').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const row = button.closest('.cart-row');
    const input = row.querySelector('.js-qty-input');

    let newQty = parseInt(input.value, 10);
    if (Number.isNaN(newQty) || newQty < 1) newQty = 1;

    updateQuantity(productId, newQty);

    renderCheckout();
    updateCartQuantity();
  });
});
}

renderCheckout();
updateCartQuantity();