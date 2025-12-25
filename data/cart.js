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

