import {
  formatOrdersDate,
  getDeliveryDateMs,
  getDeliveryText
} from '../../scripts/utils/ordersUtils.js';

describe('ordersUtils', () => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const deliveryOptions = [
    { id: '1', deliveryDays: 3 },
    { id: '2', deliveryDays: 7 }
  ];

  describe('formatOrdersDate', () => {
    it('returns empty string when ms is missing', () => {
      expect(formatOrdersDate()).toBe('');
      expect(formatOrdersDate(null)).toBe('');
      expect(formatOrdersDate(0)).toBe('');
    });

    it('returns a non-empty string for a valid ms', () => {
      const result = formatOrdersDate(1700000000000);
      expect(typeof result).toBe('string');
      expect(result.length > 0).toBe(true);
    });
  });

  describe('getDeliveryDateMs', () => {
    it('uses selected delivery option id', () => {
      const base = 1700000000000;
      const ms = getDeliveryDateMs(base, '2', deliveryOptions);
      expect(ms).toBe(base + 7 * MS_PER_DAY);
    });

    it('falls back to option id=1 (or first option) when id is missing/unknown', () => {
      const base = 1700000000000;

      const msMissing = getDeliveryDateMs(base, undefined, deliveryOptions);
      expect(msMissing).toBe(base + 3 * MS_PER_DAY);

      const msUnknown = getDeliveryDateMs(base, 'does-not-exist', deliveryOptions);
      expect(msUnknown).toBe(base + 3 * MS_PER_DAY);
    });
  });

  describe('getDeliveryText', () => {
    afterEach(() => {
      if (Date.now && Date.now.calls) {
        Date.now.and.callThrough();
      }
    });

    it('returns "Arrives on ..." when now is before delivery', () => {
      const base = 1700000000000;
      spyOn(Date, 'now').and.returnValue(base);

      const text = getDeliveryText(base, '1', deliveryOptions);
      expect(text.startsWith('Arrives on ')).toBe(true);
    });

    it('returns "Delivered on ..." when now is after delivery', () => {
      const base = 1700000000000;
      const deliveryMs = base + 3 * MS_PER_DAY;

      spyOn(Date, 'now').and.returnValue(deliveryMs + 1);

      const text = getDeliveryText(base, '1', deliveryOptions);
      expect(text.startsWith('Delivered on ')).toBe(true);
    });
  });
});