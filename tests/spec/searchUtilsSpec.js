import { filterProducts, normalizeSearch } from "../../scripts/utils/searchUtils.js";

describe('searchUtils', () => {
  describe('normalizeSearch', () => {
    it('trims and lowercases', () => {
      expect(normalizeSearch('  SoCkS ')).toBe('socks');
    });

    it('converts non-string values to string safely', () => {
      expect(normalizeSearch(123)).toBe('123');
    });

    it('handles null/undefined safely', () => {
      expect(normalizeSearch(null)).toBe('');
      expect(normalizeSearch(undefined)).toBe('');
    });
  });

describe("filterProdutts", () => {
  const products = [
    { id: "p1", name: "Black Socks", priceCents: 1090 },
    { id: "p2", name: "Basketball", priceCents: 2095 },
    { id: "p3", name: "T-Shirt Pack", priceCents: 799 }
  ];

  it('returns original list when query is empty', () => {
      expect(filterProducts(products, '')).toBe(products);
      expect(filterProducts(products, '   ')).toBe(products);
    });

    it('filters by name (case-insensitive)', () => {
      const result = filterProducts(products, 'SOCK');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('p1');
    });

    it('returns empty array when no match', () => {
      expect(filterProducts(products, 'zzz')).toEqual([]);
    });

    it('handles missing product names without crashing', () => {
      const weird = [{ id: 'x' }, { id: 'p1', name: 'Black Socks' }];
      const result = filterProducts(weird, 'socks');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('p1');
    });
  });
});

