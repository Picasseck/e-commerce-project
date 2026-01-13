export function formatOrdersDate(ms) {
  if(!ms) return '';
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(ms));
}

export function getDeliveryDateMs(orderTimeMs, deliveryOptionId, deliveryOptions) {

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const base = Number.isFinite(orderTimeMs) ? orderTimeMs : Date.now();
  const options =
    Array.isArray(deliveryOptions) && deliveryOptions.length
      ? deliveryOptions
      : [{ id: '1', deliveryDays: 0 }];
  const id = deliveryOptionId || '1';
  const option = options.find((option) => option.id === id) || options[0];
  return base + days * MS_PER_DAY;
}

export function getDeliveryText(orderTimeMs, deliveryOptionId, deliveryOptions) {
  const deliveryMs = getDeliveryDateMs(orderTimeMs, deliveryOptionId, deliveryOptions);

  const now = Date.now();
  const dateString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(deliveryMs));

  return now >= deliveryMs
    ? `Delivered on ${dateString}`
    : `Arrives on ${dateString}`;
}
