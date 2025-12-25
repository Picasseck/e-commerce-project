import { products } from "../data/products.js";
import { addToCart, calculateCartQuantity } from '../data/cart.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatMoney(cents) {
  return (cents / 100).toFixed(2);
}

function upadateCartQuantity() {
  const countEl = $('.js-cart-quantity');
  if(!countEl) return;
  countEl.innerHTML = calculateCartQuantity();
}

function renderProductsGrid() {
   let html = '';
   
    products.forEach((product) =>{
      html += `
      <div class="product-card">
          <div class="product-name">${product.name}</div>
          <div class="product-price">$${formatMoney(product.priceCents)}</div>

          <div class="added-to-cart">
          <img class="added-icon" src="images/check-mark.png">
          Added
          </div>
        
        <button class="add-to-cart-button js-add-to-cart"
           data-product-id="${product.id}">
          Add to cart
        </button>
      </div>
      `
    })

    const productsGrid = $('.js-products-grid');
  if (!productsGrid) return;
  productsGrid.innerHTML = html
    

    $$('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        addToCart(productId, 1);
        const container = button.closest('.product-card');
        const added = container.querySelector('.added-to-cart');
        added.classList.add('is-visible');
        clearTimeout(added._timer);
        added._timer = setTimeout(() => {
          added.classList.remove('is-visible');
        }, 1200);
        upadateCartQuantity()
      })
    });
}
renderProductsGrid();
upadateCartQuantity();