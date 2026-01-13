import { clamp, getProgressPercent, getStepIndex } from '../../scripts/utils/trackingUtils.js';

describe('trackingUtils', () => {
  describe('clamp', () => {
    it('clamps below min', () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });

    it('clamps above max', () => {
      expect(clamp(99, 0, 10)).toBe(10);
    });

    it('keeps value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe('getProgressPercent', () => {
    it('returns 0 for invalid inputs', () => {
      expect(getProgressPercent(Date.now(), 0, 100)).toBe(0);
      expect(getProgressPercent(Date.now(), 100, 50)).toBe(0);
    });

    it('returns 0 at start, 100 at end', () => {
      expect(getProgressPercent(1000, 1000, 2000)).toBe(0);
      expect(getProgressPercent(2000, 1000, 2000)).toBe(100);
    });

    it('returns 50 at midpoint', () => {
      expect(getProgressPercent(1500, 1000, 2000)).toBe(50);
    });

    it('clamps beyond range', () => {
      expect(getProgressPercent(9999, 1000, 2000)).toBe(100);
      expect(getProgressPercent(0, 1000, 2000)).toBe(0);
    });
  });

  describe('getStepIndex', () => {
    it('maps percent to step index', () => {
      expect(getStepIndex(0)).toBe(0);
      expect(getStepIndex(24.9)).toBe(0);
      expect(getStepIndex(25)).toBe(1);
      expect(getStepIndex(50)).toBe(2);
      expect(getStepIndex(75)).toBe(3);
      expect(getStepIndex(100)).toBe(3);
    });
  });
});