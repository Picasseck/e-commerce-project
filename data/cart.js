let cart = loadFromStorage();

function loadFromStorage(){
  const raw = localStorage.getItem('cart');
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : [];
  } catch (event) {
    parsed = [];
  }

  if(!Array.isArray(parsed)){ 
    parsed = [];
  }
  parsed.forEach(item => {
    if(!item.deliveryOptionId){
      item.deliveryOptionId = '1';
    }
    
  });
  return parsed;
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId,quantity = 1, deliveryOptionId = '1') {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if(matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity, deliveryOptionId });
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

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(cartItem => cartItem.productId === productId);
  if (!item) return;

  item.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
