import { describe, it, expect } from 'vitest';
import { normalizeText, tokenize } from '@/lib/text-normalize';

describe('text-normalize', () => {
  it('normalizes French accents and diacritics', () => {
    expect(normalizeText("J'ai mal à la tête !")).toBe('j ai mal a la tete');
    expect(normalizeText('Fièvre, toux et vertiges.')).toBe('fievre toux et vertiges');
    expect(normalizeText('Médicament & ordonnance')).toBe('medicament ordonnance');
  });

  it('normalizes Arabic tashkeel, alef variants, and taa marbuta', () => {
    // Alef variants
    expect(normalizeText('ألم في الرأس')).toBe('الم في الراس');
    expect(normalizeText('إسعاف')).toBe('اسعاف');
    expect(normalizeText('آمن')).toBe('امن');

    // Taa marbuta and Alif Maqsura
    expect(normalizeText('صيدلية')).toBe('صيدليه');
    expect(normalizeText('مستشفى')).toBe('مستشفي');

    // Tashkeel / Harakat
    expect(normalizeText('صُدَاعٌ')).toBe('صداع');
    expect(normalizeText('دَوَاءٌ')).toBe('دواء');
  });

  it('normalizes English punctuation and capitalization', () => {
    expect(normalizeText('I have a headache!')).toBe('i have a headache');
    expect(normalizeText('Where does it hurt?')).toBe('where does it hurt');
  });

  it('tokenizes normalized words into array', () => {
    expect(tokenize('Mal à la tête')).toEqual(['mal', 'a', 'la', 'tete']);
    expect(tokenize('')).toEqual([]);
  });
});
