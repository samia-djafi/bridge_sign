import { SpokenLang, TextToSignResult } from '@/types/domain';
import { TextToSignService } from '@/types/services';
import { SEED_PHRASES } from '@/data/phrasebook';
import { normalizeText, tokenize } from '@/lib/text-normalize';
import { combinedScore, matchDurationSlot } from '@/lib/fuzzy';

export class AppTextToSignService implements TextToSignService {
  async sentenceToGloss(text: string, lang: SpokenLang): Promise<TextToSignResult> {
    const norm = normalizeText(text);
    if (!norm) {
      return { gloss: [], unsupportedTokens: [], suggestions: [] };
    }

    // 1. Exact match against seed phrases
    for (const phrase of SEED_PHRASES) {
      if (normalizeText(phrase.text[lang]) === norm) {
        return {
          gloss: phrase.gloss,
          unsupportedTokens: [],
          matchedPhraseId: phrase.id,
          suggestions: [],
        };
      }
    }

    // 2. Slot template match (Duration)
    const slotResult = matchDurationSlot(text, lang);
    if (slotResult && slotResult.matched) {
      return {
        gloss: slotResult.gloss,
        unsupportedTokens: [],
        suggestions: [],
      };
    }

    // 3. Fuzzy similarity match (>= 0.80)
    let bestScore = 0;
    let bestPhrase = SEED_PHRASES[0];
    const scoredPhrases: { id: string; score: number }[] = [];

    for (const phrase of SEED_PHRASES) {
      const score = combinedScore(text, phrase.text[lang]);
      scoredPhrases.push({ id: phrase.id, score });
      if (score > bestScore) {
        bestScore = score;
        bestPhrase = phrase;
      }
    }

    if (bestScore >= 0.80 && bestPhrase) {
      return {
        gloss: bestPhrase.gloss,
        unsupportedTokens: [],
        matchedPhraseId: bestPhrase.id,
        suggestions: [],
      };
    }

    // 4. No confident match: find unsupported tokens and top-3 suggestions
    scoredPhrases.sort((a, b) => b.score - a.score);
    const topSuggestions = scoredPhrases.slice(0, 3).map((item) => item.id);

    const inputTokens = tokenize(text);
    return {
      gloss: [],
      unsupportedTokens: inputTokens,
      suggestions: topSuggestions,
    };
  }
}

export const textToSignService = new AppTextToSignService();
