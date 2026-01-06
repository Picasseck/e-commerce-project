let orders = loadFromStorage();

function loadFromStorage() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrders() {
  return orders.map((order) => ({
    ...order,
    items: (order.items || []).map((item) => ({ ...item }))
  }));
}

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function clearOrders() {
  orders = [];
  saveToStorage();
}