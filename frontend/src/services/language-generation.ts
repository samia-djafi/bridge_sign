import { SpokenLang, Translation } from '@/types/domain';
import { LanguageGenerationService } from '@/types/services';
import { SEED_PHRASES } from '@/data/phrasebook';
import { SUPPORTED_SIGNS } from '@/data/vocabulary.config';

const SIGN_MAP = new Map(SUPPORTED_SIGNS.map((s) => [s.gloss, s]));

export class AppLanguageGenerationService implements LanguageGenerationService {
  async glossToSentence(gloss: string[], _targets?: SpokenLang[]): Promise<Translation> {
    if (gloss.length === 0) {
      return { fr: '', ar: '', en: '' };
    }

    const key = gloss.join(' ');

    // 1. Direct match with phrasebook
    for (const phrase of SEED_PHRASES) {
      if (phrase.gloss.join(' ') === key) {
        return { ...phrase.text };
      }
    }

    // 2. Specific duration slot sequences
    if (gloss[0] === 'SINCE' && gloss[1]) {
      const dur = gloss[1];
      if (dur === 'YESTERDAY') {
        return { fr: 'Depuis hier.', ar: 'منذ أمس.', en: 'Since yesterday.' };
      }
      if (dur === 'TODAY') {
        return { fr: "Depuis aujourd'hui.", ar: 'منذ اليوم.', en: 'Since today.' };
      }
      if (dur === 'TWO_DAYS') {
        return { fr: 'Depuis deux jours.', ar: 'منذ يومين.', en: 'Since two days.' };
      }
      if (dur === 'ONE_WEEK') {
        return { fr: 'Depuis une semaine.', ar: 'منذ أسبوع.', en: 'Since one week.' };
      }
    }

    // 3. Fallback: compose readable sentence from sign labels
    const frTokens: string[] = [];
    const arTokens: string[] = [];
    const enTokens: string[] = [];

    for (const g of gloss) {
      const sign = SIGN_MAP.get(g);
      if (sign) {
        frTokens.push(sign.labels.fr);
        arTokens.push(sign.labels.ar);
        enTokens.push(sign.labels.en);
      } else {
        frTokens.push(g);
        arTokens.push(g);
        enTokens.push(g);
      }
    }

    return {
      fr: frTokens.join(' ') + '.',
      ar: arTokens.join(' ') + '.',
      en: enTokens.join(' ') + '.',
    };
  }
}

export const languageGenerationService = new AppLanguageGenerationService();
