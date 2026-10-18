import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SEED_PHRASES } from '@/data/phrasebook';
import { ESSENTIAL_VOCABULARY } from '@/data/vocabulary';
import { registry } from '@/services/registry';
import { normalizeText } from '@/lib/text-normalize';

describe('Phrasebook Enhancement — Content & Distribution', () => {
  it('contains exactly 87 unique phrases with concise emergency set', () => {
    expect(SEED_PHRASES).toHaveLength(87);
  });

  it('matches the required category distribution (with emergency kept between 8-12 max)', () => {
    const pharmacyMedical = SEED_PHRASES.filter((p) => p.category === 'pharmacy_medical');
    const emergency = SEED_PHRASES.filter((p) => p.category === 'emergency');
    const everyday = SEED_PHRASES.filter((p) => p.category === 'everyday');
    const healthAccess = SEED_PHRASES.filter((p) => p.category === 'health_access');

    expect(pharmacyMedical).toHaveLength(40);
    expect(emergency.length).toBeGreaterThanOrEqual(8);
    expect(emergency.length).toBeLessThanOrEqual(12);
    expect(emergency).toHaveLength(12);
    expect(everyday).toHaveLength(25);
    expect(healthAccess).toHaveLength(10);
    expect(pharmacyMedical.length + emergency.length + everyday.length + healthAccess.length).toBe(87);
  });

  it('every emergency phrase has emergency flag set to true', () => {
    const emergency = SEED_PHRASES.filter((p) => p.category === 'emergency');
    emergency.forEach((p) => {
      expect(p.emergency).toBe(true);
    });
  });

  it('contains zero duplicate phrase IDs', () => {
    const ids = SEED_PHRASES.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(87);
  });

  it('contains zero duplicate phrase texts across all three languages', () => {
    const enTexts = new Set<string>();
    const frTexts = new Set<string>();
    const arTexts = new Set<string>();

    SEED_PHRASES.forEach((p) => {
      const normEn = normalizeText(p.text.en);
      const normFr = normalizeText(p.text.fr);
      const normAr = normalizeText(p.text.ar);

      expect(normEn.length).toBeGreaterThan(0);
      expect(normFr.length).toBeGreaterThan(0);
      expect(normAr.length).toBeGreaterThan(0);

      expect(enTexts.has(normEn)).toBe(false);
      expect(frTexts.has(normFr)).toBe(false);
      expect(arTexts.has(normAr)).toBe(false);

      enTexts.add(normEn);
      frTexts.add(normFr);
      arTexts.add(normAr);
    });
  });

  it('maintains backwards compatibility for mock recognition indices', () => {
    // 0: Headache, 1: Pain, 2: Fever, 8: Need medicine, 14: Appointment have
    expect(SEED_PHRASES[0]?.id).toBe('ph_headache');
    expect(SEED_PHRASES[1]?.id).toBe('ph_pain');
    expect(SEED_PHRASES[2]?.id).toBe('ph_fever');
    expect(SEED_PHRASES[8]?.id).toBe('ph_need_medicine');
    expect(SEED_PHRASES[14]?.id).toBe('ph_appointment_have');
  });
});

describe('Essential Vocabulary Collection', () => {
  it('contains between 40 and 60 unique vocabulary words', () => {
    expect(ESSENTIAL_VOCABULARY.length).toBeGreaterThanOrEqual(40);
    expect(ESSENTIAL_VOCABULARY.length).toBeLessThanOrEqual(60);
    expect(ESSENTIAL_VOCABULARY).toHaveLength(52);
  });

  it('covers all suggested vocabulary categories without overlap', () => {
    const bodyParts = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'body_parts');
    const symptoms = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'symptoms');
    const pharmacy = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'pharmacy_medicines');
    const places = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'medical_places');
    const everyday = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'everyday_needs');
    const communication = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'communication');
    const urgency = ESSENTIAL_VOCABULARY.filter((v) => v.category === 'urgency');

    expect(bodyParts).toHaveLength(10);
    expect(symptoms).toHaveLength(8);
    expect(pharmacy).toHaveLength(8);
    expect(places).toHaveLength(6);
    expect(everyday).toHaveLength(7);
    expect(communication).toHaveLength(7);
    expect(urgency).toHaveLength(6);
  });

  it('contains zero duplicate vocabulary IDs and zero duplicate words', () => {
    const ids = new Set<string>();
    const enWords = new Set<string>();
    const frWords = new Set<string>();
    const arWords = new Set<string>();

    ESSENTIAL_VOCABULARY.forEach((item) => {
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);

      const normEn = normalizeText(item.text.en);
      const normFr = normalizeText(item.text.fr);
      const normAr = normalizeText(item.text.ar);

      expect(normEn.length).toBeGreaterThan(0);
      expect(normFr.length).toBeGreaterThan(0);
      expect(normAr.length).toBeGreaterThan(0);

      expect(enWords.has(normEn)).toBe(false);
      expect(frWords.has(normFr)).toBe(false);
      expect(arWords.has(normAr)).toBe(false);

      enWords.add(normEn);
      frWords.add(normFr);
      arWords.add(normAr);
    });
  });

  it('vocabulary words are distinct from phrase IDs', () => {
    const phraseIds = new Set(SEED_PHRASES.map((p) => p.id));
    ESSENTIAL_VOCABULARY.forEach((v) => {
      expect(phraseIds.has(v.id)).toBe(false);
      expect(v.id.startsWith('voc_')).toBe(true);
    });
  });
});

describe('Phrasebook Service & Search Capabilities', () => {
  it('searches phrases across English, French, Arabic and category filters', async () => {
    // English search
    const enResults = await registry.phrasebook.search('headache');
    expect(enResults.some((p) => p.id === 'ph_headache')).toBe(true);

    // French search
    const frResults = await registry.phrasebook.search('tête');
    expect(frResults.some((p) => p.id === 'ph_headache')).toBe(true);

    // Arabic search
    const arResults = await registry.phrasebook.search('صداع');
    expect(arResults.some((p) => p.id === 'ph_headache')).toBe(true);

    // Category filter: emergency
    const emergencyList = await registry.phrasebook.search('', { category: 'emergency' });
    expect(emergencyList).toHaveLength(12);

    // Category filter: pharmacy_medical
    const medicalList = await registry.phrasebook.search('', { category: 'pharmacy_medical' });
    expect(medicalList).toHaveLength(40);

    // Category filter: everyday
    const everydayList = await registry.phrasebook.search('', { category: 'everyday' });
    expect(everydayList).toHaveLength(25);

    // Category filter: health_access
    const healthList = await registry.phrasebook.search('', { category: 'health_access' });
    expect(healthList).toHaveLength(10);
  });

  it('searches essential vocabulary across languages and categories', async () => {
    const waterResults = await registry.phrasebook.searchVocabulary('water');
    expect(waterResults.some((v) => v.id === 'voc_water')).toBe(true);

    const arabicResults = await registry.phrasebook.searchVocabulary('ماء');
    expect(arabicResults.some((v) => v.id === 'voc_water')).toBe(true);

    const bodyResults = await registry.phrasebook.searchVocabulary('', { category: 'body_parts' });
    expect(bodyResults).toHaveLength(10);
  });

  it('supports toggling favorites for both phrases and vocabulary', async () => {
    const isFavPhrase = await registry.phrasebook.toggleFavorite('ph_headache');
    expect(isFavPhrase).toBe(true);
    expect(await registry.phrasebook.isFavorite('ph_headache')).toBe(true);

    const isFavVocab = await registry.phrasebook.toggleFavorite('voc_head');
    expect(isFavVocab).toBe(true);
    expect(await registry.phrasebook.isFavorite('voc_head')).toBe(true);

    const favs = await registry.phrasebook.getFavorites();
    expect(favs).toContain('ph_headache');
    expect(favs).toContain('voc_head');

    // Untoggle
    await registry.phrasebook.toggleFavorite('ph_headache');
    await registry.phrasebook.toggleFavorite('voc_head');
    expect(await registry.phrasebook.isFavorite('ph_headache')).toBe(false);
    expect(await registry.phrasebook.isFavorite('voc_head')).toBe(false);
  });
});

describe('Audio Playback & Speech Synthesis', () => {
  beforeEach(() => {
    // Setup window.speechSynthesis mock in test environment
    const mockVoices = [
      { name: 'Google US English', lang: 'en-US', default: true },
      { name: 'Google Français', lang: 'fr-FR', default: false },
      { name: 'Google Arabic', lang: 'ar-SA', default: false },
    ];

    (window as any).speechSynthesis = {
      speak: vi.fn((utterance: any) => {
        if (utterance.onend) utterance.onend();
      }),
      cancel: vi.fn(),
      getVoices: vi.fn(() => mockVoices),
    };
  });

  it('plays audio in English for a phrase', async () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');
    const cancelSpy = vi.spyOn(window.speechSynthesis, 'cancel');

    await registry.speech.tts.speak({
      text: 'I have a headache.',
      lang: 'en',
    });

    expect(cancelSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalled();
    const utterance = speakSpy.mock.calls[0]![0] as unknown as SpeechSynthesisUtterance;
    expect(utterance.text).toBe('I have a headache.');
    expect(utterance.lang).toBe('en-US');
  });

  it('plays audio in French for a phrase', async () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');

    await registry.speech.tts.speak({
      text: "J'ai mal à la tête.",
      lang: 'fr',
    });

    expect(speakSpy).toHaveBeenCalled();
    const utterance = speakSpy.mock.calls[0]![0] as unknown as SpeechSynthesisUtterance;
    expect(utterance.text).toBe("J'ai mal à la tête.");
    expect(utterance.lang).toBe('fr-FR');
  });

  it('plays audio in Arabic for a phrase', async () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');

    await registry.speech.tts.speak({
      text: 'عندي صداع في الرأس.',
      lang: 'ar',
    });

    expect(speakSpy).toHaveBeenCalled();
    const utterance = speakSpy.mock.calls[0]![0] as unknown as SpeechSynthesisUtterance;
    expect(utterance.text).toBe('عندي صداع في الرأس.');
    expect(utterance.lang).toBe('ar-SA');
  });

  it('plays audio for vocabulary words in EN, FR, and AR', async () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');

    // English word
    await registry.speech.tts.speak({ text: 'Head', lang: 'en' });
    // French word
    await registry.speech.tts.speak({ text: 'Tête', lang: 'fr' });
    // Arabic word
    await registry.speech.tts.speak({ text: 'رأس', lang: 'ar' });

    expect(speakSpy).toHaveBeenCalledTimes(3);
  });

  it('rejects gracefully when no voice exists for the target language rather than mispronouncing', async () => {
    // Only English and French voices installed
    (window as any).speechSynthesis.getVoices = vi.fn(() => [
      { name: 'Google US English', lang: 'en-US', default: true },
    ]);

    await expect(
      registry.speech.tts.speak({
        text: 'عندي صداع',
        lang: 'ar',
      })
    ).rejects.toThrow('NO_VOICE_FOR_LANG_ar');
  });
});
