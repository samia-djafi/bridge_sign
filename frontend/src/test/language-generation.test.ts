import { describe, it, expect } from 'vitest';
import { languageGenerationService } from '@/services/language-generation';

describe('language-generation engine', () => {
  it('reconstructs full translations for known phrase glosses', async () => {
    const res = await languageGenerationService.glossToSentence(['HEADACHE']);
    expect(res.fr).toBe("J'ai mal à la tête.");
    expect(res.ar).toBe('عندي صداع في الرأس.');
    expect(res.en).toBe('I have a headache.');
  });

  it('reconstructs duration slots from gloss sequences', async () => {
    const res = await languageGenerationService.glossToSentence(['SINCE', 'YESTERDAY']);
    expect(res.fr).toBe('Depuis hier.');
    expect(res.ar).toBe('منذ أمس.');
    expect(res.en).toBe('Since yesterday.');
  });

  it('synthesizes sentences from sequence of signs', async () => {
    const res = await languageGenerationService.glossToSentence(['HELP']);
    expect(res.fr).toBe("À l'aide !");
  });
});
