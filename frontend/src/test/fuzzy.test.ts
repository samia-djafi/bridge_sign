import { describe, it, expect } from 'vitest';
import {
  damerauLevenshteinDistance,
  stringSimilarity,
  tokenSetSimilarity,
  combinedScore,
  matchDurationSlot,
} from '@/lib/fuzzy';

describe('fuzzy matching and slot extraction', () => {
  it('calculates Damerau-Levenshtein distance correctly with transposition', () => {
    expect(damerauLevenshteinDistance('hello', 'hello')).toBe(0);
    expect(damerauLevenshteinDistance('helo', 'hello')).toBe(1);
    expect(damerauLevenshteinDistance('hlelo', 'hello')).toBe(1); // transposition
  });

  it('measures high similarity for minor typos', () => {
    expect(stringSimilarity("j'ai mal a la tete", "j'ai mal a la tet")).toBeGreaterThan(0.9);
    expect(tokenSetSimilarity('j ai mal a la tete', 'tete mal a la j ai')).toBe(1.0);
    expect(combinedScore("j'ai mal a la tete", "j'ai mal à la tête")).toBeGreaterThan(0.95);
  });

  it('matches duration slot expressions in French, Arabic, and English', () => {
    // French
    const frResult = matchDurationSlot('depuis hier', 'fr');
    expect(frResult).not.toBeNull();
    expect(frResult?.matched).toBe(true);
    expect(frResult?.gloss).toEqual(['SINCE', 'YESTERDAY']);

    // Arabic
    const arResult = matchDurationSlot('منذ أمس', 'ar');
    expect(arResult).not.toBeNull();
    expect(arResult?.matched).toBe(true);
    expect(arResult?.gloss).toEqual(['SINCE', 'YESTERDAY']);

    // English
    const enResult = matchDurationSlot('since yesterday', 'en');
    expect(enResult).not.toBeNull();
    expect(enResult?.matched).toBe(true);
    expect(enResult?.gloss).toEqual(['SINCE', 'YESTERDAY']);
  });

  it('returns null for non-duration inputs', () => {
    expect(matchDurationSlot('bonjour', 'fr')).toBeNull();
    expect(matchDurationSlot('ou avez-vous mal', 'fr')).toBeNull();
  });
});
