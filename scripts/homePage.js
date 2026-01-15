import { products, loadProductsFetch } from "../data/products.js";
import { addToCart, calculateCartQuantity } from '../data/cart.js';
import { formatMoney } from "./utils/money.js";
import { filterProducts } from "./utils/searchUtils.js";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function upadateCartQuantity() {
  const countEl = $('.js-cart-quantity');
  if(!countEl) return;
  countEl.innerHTML = calculateCartQuantity();
}

function renderProductsGrid(list) {

  const productsGrid = $(".js-products-grid");
  if (!productsGrid) return;

  if (!list || list.length === 0) {
    productsGrid.innerHTML = `<p>No products found.</p>`;
    return;
  }
   let html = '';
   
    list.forEach((product) =>{
      html += `
      
      <div class="product-card">
        <img class="product-image" src="${product.images}" alt="${product.name}">

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

  productsGrid.innerHTML = html;

  attachAddToCartListener();
}
    
  function attachAddToCartListener() {
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

function getSearchFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("search") || "";
}

function setSearchInUrl(rawText) {
  const url = new URL(window.location.href);
  const trimmed = rawText.trim();

  if (trimmed) url.searchParams.set("search", trimmed);
  else url.searchParams.delete("search");

  history.replaceState(null, "", url);
}

function applySearch(rawText) {
  const filtered = filterProducts(products, rawText);
  renderProductsGrid(filtered);
  setSearchInUrl(rawText);
}

function setupSearch() {
  const input = $(".search-input");
  const button = $(".search-button");
  if (!input || !button) return;

  const initial = getSearchFromUrl();
  input.value = initial;

  applySearch(input.value);

  input.addEventListener("input", () => {
    applySearch(input.value);
  });

  button.addEventListener("click", () => {
    applySearch(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      applySearch(input.value);
    }
  });
}

  async function main() {
    try {
      await loadProductsFetch();
  renderProductsGrid(products);
  upadateCartQuantity();
  setupSearch();
    } catch (error) {
      console.error(error);
      const grid = $('.js-products-grid');
      if (grid) {
        grid.innerHTML = `<p>Unable to load products. Start a local server (Live Server) and refresh.</p>`;
      }
      upadateCartQuantity();
    }
  }

main();