import { products } from '../data/products.js';
import { getCartItems, calculateCartQuantity, removeFromCart, updateQuantity, clearCart} from '../data/cart.js';
import { formatMoney } from './utils/money.js';
import { getProductById, calculateLineTotalCents, calculateSubtotalCents, calculateShippingCents, calculateTaxCents, calculateTotalCents } from './utils/cartTotals.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);



function updateCartQuantity() {
  const el = $('.js-cart-quantity');
  if (!el) return;
  el.textContent = calculateCartQuantity();
}


function renderSummary({subtotalCents, shippingCents, taxCents, totalCents}, isCartEmpty) {
  const root = $('.js-checkout-summary');
  if (!root) return;

  root.innerHTML = `
    <div class="summary">
      <div class="summary-title">Order Summary</div>

      <div class="summary-row">
        <div>Subtotal</div>
        <div>$${formatMoney(subtotalCents)}</div>
      </div>

      <div class="summary-row">
        <div>Shipping</div>
        <div>$${formatMoney(shippingCents)}</div>
      </div>

      <div class="summary-row">
        <div>Tax</div>
        <div>$${formatMoney(taxCents)}</div>
      </div>

      <div class="summary-row summary-total">
        <div>Total</div>
        <div>$${formatMoney(totalCents)}</div>
      </div>

      <button type="button" class="place-order-button js-place-order" ${isCartEmpty ? 'disabled' : ''}>
        Place order
      </button>
    </div>
  `;

  const placeButton = root.querySelector('.js-place-order');
  if (!placeButton) return;

  placeButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearCart();
    renderCheckout();
    updateCartQuantity();
  });
}

function renderCheckout() {
  const root = $('.js-checkout');
  if (!root) return;

  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    root.innerHTML = `<p>Your cart is empty.</p>`;
    renderSummary({subtotalCents: 0, shippingCents: 0, taxCents: 0, totalCents: 0});
    return;
  }

  const subtotalCents = calculateSubtotalCents(cartItems, products);
  const shippingCents = calculateShippingCents(subtotalCents);
  const taxCents = calculateTaxCents(subtotalCents);
  const totalCents = calculateTotalCents(subtotalCents, shippingCents, taxCents);
  

  const html = cartItems.map((cartItem) => {
    const product = getProductById(products, cartItem.productId);
    const name = product ? product.name : '(Unknown product)';
    const priceCents = product ? product.priceCents : 0;
    const lineToTalCents = calculateLineTotalCents(priceCents, cartItem.quantity)
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
  renderSummary({ subtotalCents, shippingCents, taxCents, totalCents }, false);

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

    let startQty = parseInt(input.value, 10);
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