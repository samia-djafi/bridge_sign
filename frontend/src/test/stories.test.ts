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

describe('Google Forms Feedback Integration', () => {
  it('exports correct Google Forms URLs and Entry IDs', async () => {
    const {
      GOOGLE_FORM_SHORT_URL,
      GOOGLE_FORM_VIEW_URL,
      FORM_ENTRY_IDS,
      PROFILE_FORM_VALUES,
    } = await import('@/features/stories/StoriesPage');

    expect(GOOGLE_FORM_SHORT_URL).toBe('https://forms.gle/ecHfLfLVqgFRW8Bw9');
    expect(GOOGLE_FORM_VIEW_URL).toContain('docs.google.com/forms/d/e/1FAIpQLSeMpIBUVY6hPLnryGdDBlT1ocNUVaYx4-Ss59wRw9qDZGJo-g/viewform');

    expect(FORM_ENTRY_IDS.name).toBe('entry.380116650');
    expect(FORM_ENTRY_IDS.profile).toBe('entry.1143297058');
    expect(FORM_ENTRY_IDS.feedback).toBe('entry.1482854505');
    expect(FORM_ENTRY_IDS.contact).toBe('entry.1478387733');

    expect(PROFILE_FORM_VALUES.deaf).toBe('Deaf or hard of hearing person');
    expect(PROFILE_FORM_VALUES.family).toBe('Family member or friend');
    expect(PROFILE_FORM_VALUES.healthcare).toBe('Healthcare professional');
    expect(PROFILE_FORM_VALUES.other).toBe('Someone else');
  });

  it('builds pre-filled Google Form URL with all fields and 4 profiles', async () => {
    const { buildGoogleFormsUrl, FORM_ENTRY_IDS } = await import(
      '@/features/stories/StoriesPage'
    );

    // Test with deaf profile
    const url1 = buildGoogleFormsUrl({
      name: 'Amine',
      profile: 'deaf',
      feedback: 'Great application for Algerian Sign Language!',
      contact: 'amine@example.com',
    });

    const parsedUrl1 = new URL(url1);
    expect(parsedUrl1.searchParams.get('usp')).toBe('pp_url');
    expect(parsedUrl1.searchParams.get(FORM_ENTRY_IDS.name)).toBe('Amine');
    expect(parsedUrl1.searchParams.get(FORM_ENTRY_IDS.profile)).toBe('Deaf or hard of hearing person');
    expect(parsedUrl1.searchParams.get(FORM_ENTRY_IDS.feedback)).toBe('Great application for Algerian Sign Language!');
    expect(parsedUrl1.searchParams.get(FORM_ENTRY_IDS.contact)).toBe('amine@example.com');

    // Test with 'other' (Someone else) profile and minimal fields
    const url2 = buildGoogleFormsUrl({
      profile: 'other',
      feedback: 'Feedback from another user',
    });

    const parsedUrl2 = new URL(url2);
    expect(parsedUrl2.searchParams.get(FORM_ENTRY_IDS.name)).toBeNull();
    expect(parsedUrl2.searchParams.get(FORM_ENTRY_IDS.profile)).toBe('Someone else');
    expect(parsedUrl2.searchParams.get(FORM_ENTRY_IDS.feedback)).toBe('Feedback from another user');
    expect(parsedUrl2.searchParams.get(FORM_ENTRY_IDS.contact)).toBeNull();

    // Test with family profile
    const url3 = buildGoogleFormsUrl({
      profile: 'family',
      feedback: 'Family feedback',
    });
    const parsedUrl3 = new URL(url3);
    expect(parsedUrl3.searchParams.get(FORM_ENTRY_IDS.profile)).toBe('Family member or friend');

    // Test with healthcare profile
    const url4 = buildGoogleFormsUrl({
      profile: 'healthcare',
      feedback: 'Healthcare feedback',
    });
    const parsedUrl4 = new URL(url4);
    expect(parsedUrl4.searchParams.get(FORM_ENTRY_IDS.profile)).toBe('Healthcare professional');
  });

  it('submits feedback directly in the background without opening window or redirecting', async () => {
    const {
      submitFeedbackDirectly,
      GOOGLE_FORM_RESPONSE_URL,
      FORM_ENTRY_IDS,
    } = await import('@/features/stories/StoriesPage');

    expect(GOOGLE_FORM_RESPONSE_URL).toContain('/formResponse');

    const openSpy = vi.spyOn(window, 'open');
    const fetchSpy = vi.fn().mockResolvedValue({ status: 0, type: 'opaque' });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchSpy;

    try {
      const res = await submitFeedbackDirectly({
        name: 'Fatima',
        profile: 'healthcare',
        feedback: 'Excellent assistance at the pharmacy!',
        contact: 'fatima@pharmacie.dz',
      });

      expect(res.success).toBe(true);

      // Verify that window.open was NEVER called!
      expect(openSpy).not.toHaveBeenCalled();

      // Verify that fetch was called with background POST and no-cors
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [calledUrl, calledInit] = fetchSpy.mock.calls[0]!;
      expect(calledUrl).toBe(GOOGLE_FORM_RESPONSE_URL);
      expect(calledInit.method).toBe('POST');
      expect(calledInit.mode).toBe('no-cors');
      expect(calledInit.headers['Content-Type']).toBe('application/x-www-form-urlencoded');

      const bodyParams = new URLSearchParams(calledInit.body);
      expect(bodyParams.get(FORM_ENTRY_IDS.name)).toBe('Fatima');
      expect(bodyParams.get(FORM_ENTRY_IDS.profile)).toBe('Healthcare professional');
      expect(bodyParams.get(FORM_ENTRY_IDS.feedback)).toBe('Excellent assistance at the pharmacy!');
      expect(bodyParams.get(FORM_ENTRY_IDS.contact)).toBe('fatima@pharmacie.dz');
      expect(bodyParams.get('fvv')).toBe('1');
      expect(bodyParams.get('pageHistory')).toBe('0');
    } finally {
      globalThis.fetch = originalFetch;
      openSpy.mockRestore();
    }
  });

  it('validates empty feedback and throws error', async () => {
    const { submitFeedbackDirectly } = await import('@/features/stories/StoriesPage');

    await expect(
      submitFeedbackDirectly({
        profile: 'deaf',
        feedback: '   ',
      })
    ).rejects.toThrow('FEEDBACK_EMPTY');
  });
});

