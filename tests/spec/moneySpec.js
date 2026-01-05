import { formatMoney } from '../../scripts/utils/money.js';

describe('formatMoney', () => {
  it('formats 0 cents', () => {
    expect(formatMoney(0)).toBe('0.00');
  });

  it('formats cents into dollars', () => {
    expect(formatMoney(1090)).toBe('10.90');
    expect(formatMoney(799)).toBe('7.99');
  });

  it('always returns 2 decimals', () => {
    expect(formatMoney(1)).toBe('0.01');
    expect(formatMoney(10)).toBe('0.10');
    expect(formatMoney(100)).toBe('1.00');
  });
});