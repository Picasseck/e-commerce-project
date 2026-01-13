export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function getProgressPercent(nowMs, orderTimeMs, deliveryMs) {
  if (!orderTimeMs || !deliveryMs || deliveryMs <= orderTimeMs) return 0;

  const raw = ((nowMs - orderTimeMs) / (deliveryMs - orderTimeMs)) * 100;
  return clamp(raw, 0, 100);
}

export function getStepIndex(percent) {
  if (percent < 25) return 0;   
  if (percent < 50) return 1;
  if (percent < 75) return 2;
  return 3;
}