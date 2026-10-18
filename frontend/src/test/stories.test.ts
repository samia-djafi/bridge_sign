import { describe, it, expect } from 'vitest';
import { STORIES } from '@/data/stories';

describe('BridgeSign Stories & Testimonials', () => {
  it('contains exactly three testimonials', () => {
    expect(STORIES).toHaveLength(3);
  });

  it('correctly maps cities to each testimonial', () => {
    // 1. A Brother -> Tizi-Ouzou
    // 2. A Pharmacist -> Alger
    // 3. A Deaf Person -> Tizi-Ouzou
    expect(STORIES[0]?.location).toBe('Tizi-Ouzou');
    expect(STORIES[1]?.location).toBe('Alger');
    expect(STORIES[2]?.location).toBe('Tizi-Ouzou');
  });

  it('contains no outdated locations in stories', () => {
    const locations = STORIES.map((s) => s.location);
    expect(locations).not.toContain('Constantine');
    expect(locations).not.toContain('Oran');
    expect(locations).not.toContain('Alger (Bab El Oued)');
  });

  it('Testimonial 1 (A Brother) has complete multilingual titles, roles, and quotes', () => {
    const story = STORIES[0];
    expect(story).toBeDefined();
    if (!story) return;

    expect(story.title.en).toBe('A Brother');
    expect(story.title.fr).toBe('Un frère');
    expect(story.title.ar).toBe('أخ');

    expect(story.role.en).toBe('Brother of a deaf sister');
    expect(story.role.fr).toBe("Frère d'une sœur sourde");
    expect(story.role.ar).toBe('أخ لأخت صماء');

    expect(story.location).toBe('Tizi-Ouzou');
    expect(story.badge).toBe('family');

    expect(story.quote.en).toContain('It  will help my sister attend her appointments');
    expect(story.quote.fr).toContain('aidera ma sœur à se rendre à ses rendez-vous');
    expect(story.quote.ar).toContain('سيساعد  أختي على الذهاب إلى مواعيدها');
  });

  it('Testimonial 2 (A Pharmacist) has complete multilingual titles, roles, and quotes', () => {
    const story = STORIES[1];
    expect(story).toBeDefined();
    if (!story) return;

    expect(story.title.en).toBe('A Pharmacist');
    expect(story.title.fr).toBe('Un pharmacien');
    expect(story.title.ar).toBe('صيدلي');

    expect(story.role.en).toBe('Healthcare professional');
    expect(story.role.fr).toBe('Professionnel de santé');
    expect(story.role.ar).toBe('ممارس رعاية صحية');

    expect(story.location).toBe('Alger');
    expect(story.badge).toBe('healthcare');

    expect(story.quote.en).toContain('Every patient deserves to explain their symptoms');
    expect(story.quote.fr).toContain('Chaque patient mérite de pouvoir expliquer ses symptômes');
    expect(story.quote.ar).toContain('يستحق كل مريض أن يشرح أعراضه');
  });

  it('Testimonial 3 (A Deaf Person) has complete multilingual titles, roles, and quotes', () => {
    const story = STORIES[2];
    expect(story).toBeDefined();
    if (!story) return;

    expect(story.title.en).toBe('A Deaf Person');
    expect(story.title.fr).toBe('Une personne sourde');
    expect(story.title.ar).toBe('شخص أصم');

    expect(story.role.en).toBe('Deaf person who wants to be understood');
    expect(story.role.fr).toBe("Personne sourde désireuse d'être comprise");
    expect(story.role.ar).toBe('شخص أصم يريد أن يُفهم');

    expect(story.location).toBe('Tizi-Ouzou');
    expect(story.badge).toBe('deaf_community');

    expect(story.quote.en).toContain("Sometimes, even the simplest things become difficult when people don't understand my language");
    expect(story.quote.fr).toContain('Parfois, même les choses les plus simples deviennent difficiles');
    expect(story.quote.ar).toContain('أحيانًا، تصبح أبسط الأمور صعبة عندما لا يفهم الناس لغتي');
  });

  it('does not invent dates or mark them as illustrative scenarios', () => {
    STORIES.forEach((story) => {
      expect(story.isIllustrative).toBe(false);
      expect(story.date).toBeUndefined();
    });
  });
});
