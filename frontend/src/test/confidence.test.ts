import { describe, it, expect } from 'vitest';
import { getConfidenceLevel, formatConfidencePercent } from '@/lib/confidence';

describe('confidence calculation', () => {
  it('maps scores to high, medium, low based on thresholds', () => {
    expect(getConfidenceLevel(0.95)).toBe('high');
    expect(getConfidenceLevel(0.85)).toBe('high');
    expect(getConfidenceLevel(0.84)).toBe('medium');
    expect(getConfidenceLevel(0.70)).toBe('medium');
    expect(getConfidenceLevel(0.69)).toBe('low');
    expect(getConfidenceLevel(0.40)).toBe('low');
  });

  it('formats percentages accurately', () => {
    expect(formatConfidencePercent(0.923)).toBe('92%');
    expect(formatConfidencePercent(0.85)).toBe('85%');
  });
});
