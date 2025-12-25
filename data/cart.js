let cart = loadFromStorage();

function loadFromStorage(){
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId,quantity = 1) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if(matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveToStorage();
}

export function calculateCartQuantity() {
  return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
}

export function getCartItems() {
 return cart.map(cartItem => ({ ...cartItem}));
}

export function removeFromCart(productId){
  cart = cart.filter(cartItem => cartItem.productId !== productId);
  saveToStorage();
}

export function updateQuantity(productId, newQuantity){
  const matchingItem = cart.find(cartItem => cartItem.productId === productId);

  if(!matchingItem) return;

  if(newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}

