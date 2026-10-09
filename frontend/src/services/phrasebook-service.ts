import { Phrase } from '@/types/domain';
import { PhrasebookService } from '@/types/services';
import { SEED_PHRASES } from '@/data/phrasebook';
import { db } from './db';
import { normalizeText } from '@/lib/text-normalize';
import { combinedScore } from '@/lib/fuzzy';

class AppPhrasebookService implements PhrasebookService {
  private phrases: Phrase[] = SEED_PHRASES;

  async list(): Promise<Phrase[]> {
    return this.phrases;
  }

  async search(query: string, filters?: { category?: string; context?: string }): Promise<Phrase[]> {
    const normQ = normalizeText(query);
    const favorites = new Set(await this.getFavorites());

    let list = this.phrases;

    if (filters?.category) {
      if (filters.category === 'favorites') {
        list = list.filter((p) => favorites.has(p.id));
      } else if (filters.category === 'emergency') {
        list = list.filter((p) => p.emergency || p.category === 'emergency');
      } else {
        list = list.filter((p) => p.category === filters.category);
      }
    }

    if (filters?.context && filters.context !== 'all') {
      list = list.filter((p) => p.contexts.includes(filters.context as any));
    }

    if (!normQ) {
      return list;
    }

    return list.filter((p) => {
      const matchFr = normalizeText(p.text.fr).includes(normQ) || combinedScore(normQ, p.text.fr) >= 0.75;
      const matchAr = normalizeText(p.text.ar).includes(normQ) || combinedScore(normQ, p.text.ar) >= 0.75;
      const matchEn = normalizeText(p.text.en).includes(normQ) || combinedScore(normQ, p.text.en) >= 0.75;
      const matchGloss = p.gloss.some((g) => normalizeText(g).includes(normQ));
      return matchFr || matchAr || matchEn || matchGloss;
    });
  }

  async toggleFavorite(phraseId: string): Promise<boolean> {
    const existing = await db.favorites.get(phraseId);
    if (existing) {
      await db.favorites.delete(phraseId);
      return false;
    } else {
      await db.favorites.add({ phraseId, createdAt: Date.now() });
      return true;
    }
  }

  async isFavorite(phraseId: string): Promise<boolean> {
    const item = await db.favorites.get(phraseId);
    return !!item;
  }

  async getFavorites(): Promise<string[]> {
    const items = await db.favorites.toArray();
    return items.map((f) => f.phraseId);
  }
}

export const phrasebookService = new AppPhrasebookService();
