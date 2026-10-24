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

  it('matches candidate phrases: Hello and Thank you', async () => {
    const helloEn = await textToSignService.sentenceToGloss('Hello.', 'en');
    expect(helloEn.gloss).toEqual(['HELLO']);

    const helloFr = await textToSignService.sentenceToGloss('Bonjour.', 'fr');
    expect(helloFr.gloss).toEqual(['HELLO']);

    const helloAr = await textToSignService.sentenceToGloss('مرحبًا.', 'ar');
    expect(helloAr.gloss).toEqual(['HELLO']);

    const thanksEn = await textToSignService.sentenceToGloss('Thank you.', 'en');
    expect(thanksEn.gloss).toEqual(['THANK-YOU']);
  });

  it('matches candidate phrases: I need help and I need a doctor across languages', async () => {
    const helpEn = await textToSignService.sentenceToGloss('I need help.', 'en');
    expect(helpEn.gloss).toEqual(['NEED', 'HELP']);

    const helpFr = await textToSignService.sentenceToGloss("J'ai besoin d'aide.", 'fr');
    expect(helpFr.gloss).toEqual(['NEED', 'HELP']);

    const helpAr = await textToSignService.sentenceToGloss('أحتاج إلى مساعدة.', 'ar');
    expect(helpAr.gloss).toEqual(['NEED', 'HELP']);

    const docEn = await textToSignService.sentenceToGloss('I need a doctor.', 'en');
    expect(docEn.gloss).toEqual(['NEED', 'DOCTOR']);

    const docFr = await textToSignService.sentenceToGloss("J'ai besoin d'un médecin.", 'fr');
    expect(docFr.gloss).toEqual(['NEED', 'DOCTOR']);
  });

  it('correctly reports unsupported / planned phrases like Where is the pharmacy?', async () => {
    const resEn = await textToSignService.sentenceToGloss('Where is the pharmacy?', 'en');
    expect(resEn.gloss).toEqual([]);
    expect(resEn.unsupportedTokens.length).toBeGreaterThan(0);

    const resFr = await textToSignService.sentenceToGloss('Où est la pharmacie ?', 'fr');
    expect(resFr.gloss).toEqual([]);
  });

  it('matches multi-segment medical phrases', async () => {
    const res = await textToSignService.sentenceToGloss('My stomach hurts.', 'en');
    expect(res.gloss).toEqual(['STOMACH', 'PAIN']);
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
