import { products } from '../data/products.js';

const $ = (sel) => document.querySelector(sel);

function formatMoney(cents) {
  return (cents / 100).toFixed(2);
}

function renderProductsGrid(list) {
  const grid = $('.js-products-grid');
  if (!grid) return;

  grid.innerHTML = list
    .map(
      (p) => `
        <div class="product-card">
          <div class="product-title">${p.name}</div>
          <div class="product-price">$${formatMoney(p.priceCents)}</div>
        </div>
      `
    )
    .join('');
}

renderProductsGrid(products);