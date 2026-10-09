import { describe, it, expect } from 'vitest';
import { textToSignService } from '@/services/text-to-sign';

describe('text-to-sign engine', () => {
  it('exact matches French phrases into LSA gloss', async () => {
    const res = await textToSignService.sentenceToGloss("J'ai mal à la tête.", 'fr');
    expect(res.gloss).toEqual(['HEADACHE']);
    expect(res.unsupportedTokens).toEqual([]);
    expect(res.matchedPhraseId).toBe('ph_headache');
  });

  it('exact matches Arabic phrases into LSA gloss', async () => {
    const res = await textToSignService.sentenceToGloss('عندي صداع في الرأس.', 'ar');
    expect(res.gloss).toEqual(['HEADACHE']);
    expect(res.unsupportedTokens).toEqual([]);
  });

  it('exact matches English phrases into LSA gloss', async () => {
    const res = await textToSignService.sentenceToGloss('I have a headache.', 'en');
    expect(res.gloss).toEqual(['HEADACHE']);
    expect(res.unsupportedTokens).toEqual([]);
  });

  it('handles slot-based duration phrases', async () => {
    const res = await textToSignService.sentenceToGloss('depuis hier', 'fr');
    expect(res.gloss).toEqual(['SINCE', 'YESTERDAY']);
  });

  it('handles minor typos with fuzzy matching', async () => {
    const res = await textToSignService.sentenceToGloss('jai mal a la tet', 'fr');
    expect(res.gloss).toEqual(['HEADACHE']);
  });

  it('returns unsupportedTokens and top suggestions when outside vocabulary', async () => {
    const res = await textToSignService.sentenceToGloss('Je veux louer un sous-marin atomique pour aller sur Mars', 'fr');
    expect(res.gloss).toEqual([]);
    expect(res.unsupportedTokens.length).toBeGreaterThan(0);
    expect(res.suggestions.length).toBeLessThanOrEqual(3);
  });
});
