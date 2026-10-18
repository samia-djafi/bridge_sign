import { describe, it, expect } from 'vitest';
import en from '@/i18n/en.json';
import fr from '@/i18n/fr.json';
import ar from '@/i18n/ar.json';
import { updateHtmlDirAndLang } from '@/i18n/index';
import { STORIES } from '@/data/stories';

function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k in obj) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      keys = keys.concat(extractKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

describe('Multilingual Audit & Translation Parity', () => {
  const enKeys = extractKeys(en);
  const frKeys = extractKeys(fr);
  const arKeys = extractKeys(ar);

  it('maintains 100% key parity across all three supported locales (en, fr, ar)', () => {
    expect(enKeys).toEqual(frKeys);
    expect(enKeys).toEqual(arKeys);
  });

  it('ensures no empty or undefined strings exist across any locale', () => {
    function verifyNonEmpty(obj: Record<string, any>, locale: string) {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') {
          expect(v.trim().length, `Empty string at ${k} in ${locale}`).toBeGreaterThan(0);
        } else if (typeof v === 'object' && v !== null) {
          verifyNonEmpty(v, `${locale}.${k}`);
        }
      }
    }

    verifyNonEmpty(en, 'en');
    verifyNonEmpty(fr, 'fr');
    verifyNonEmpty(ar, 'ar');
  });

  it('contains complete Diagnostic section coverage in all 3 languages', () => {
    const requiredDiagKeys = [
      'assessmentTitle',
      'assessmentIntro',
      'stepIndicator',
      'progressLabel',
      'requiredError',
      'next',
      'previous',
      'submit',
      'retake',
      'q1Title',
      'q1Instruction',
      'q1Opt1',
      'q1Opt2',
      'q1Opt3',
      'q2Title',
      'q2Instruction',
      'q2Opt1',
      'q2Opt2',
      'q2Opt3',
      'q3Title',
      'q3Instruction',
      'q3Opt1',
      'q3Opt2',
      'q3Opt3',
      'q4Title',
      'q4Instruction',
      'q4Opt1',
      'q4Opt2',
      'q4Opt3',
      'q5Title',
      'q5Instruction',
      'q5Opt1',
      'q5Opt2',
      'q5Opt3',
      'resultsTitle',
      'scoreLabel',
      'statusOptimal',
      'statusOptimalDesc',
      'statusModerate',
      'statusModerateDesc',
      'statusNeedsAttention',
      'statusNeedsAttentionDesc',
      'recommendationsTitle',
      'recLighting',
      'recFraming',
      'recBackground',
      'nextStepsTitle',
      'actionStartConv',
      'actionTestCam',
      'actionPhrasebook',
      'metricsTitle',
      'camFps',
      'inferenceLatency',
      'pipelineHeading',
      'logs',
      'downloadLogs',
    ];

    for (const key of requiredDiagKeys) {
      expect((en.diagnostics as any)[key], `Missing en.diagnostics.${key}`).toBeDefined();
      expect((fr.diagnostics as any)[key], `Missing fr.diagnostics.${key}`).toBeDefined();
      expect((ar.diagnostics as any)[key], `Missing ar.diagnostics.${key}`).toBeDefined();
    }
  });

  it('contains complete About section coverage in all 3 languages', () => {
    const requiredAboutKeys = [
      'title',
      'missionTitle',
      'missionText',
      'visionTitle',
      'visionText',
      'barriersTitle',
      'barriersText',
      'lsaRoleTitle',
      'lsaRoleText',
      'audienceTitle',
      'audienceText',
      'howItWorksTitle',
      'pipelineLsaToLang',
      'signToLangStep',
      'pipelineLangToLsa',
      'langToSignStep',
      'limitationsTitle',
      'limitationMvp',
      'limitationInterpreter',
      'limitationDiagnosis',
      'privacyTitle',
      'privacyText',
      'ctaTitle',
      'ctaStartConv',
      'ctaTryDemo',
      'ctaPhrasebook',
      'version',
      'disclaimer',
    ];

    for (const key of requiredAboutKeys) {
      expect((en.about as any)[key], `Missing en.about.${key}`).toBeDefined();
      expect((fr.about as any)[key], `Missing fr.about.${key}`).toBeDefined();
      expect((ar.about as any)[key], `Missing ar.about.${key}`).toBeDefined();
    }
  });

  it('preserves the three Real Stories with exact city mappings and quotes', () => {
    expect(STORIES).toHaveLength(3);
    expect(STORIES[0]?.location).toBe('Tizi-Ouzou');
    expect(STORIES[1]?.location).toBe('Alger');
    expect(STORIES[2]?.location).toBe('Tizi-Ouzou');

    for (const story of STORIES) {
      expect(story.title.en).toBeTruthy();
      expect(story.title.fr).toBeTruthy();
      expect(story.title.ar).toBeTruthy();

      expect(story.role.en).toBeTruthy();
      expect(story.role.fr).toBeTruthy();
      expect(story.role.ar).toBeTruthy();

      expect(story.quote.en).toBeTruthy();
      expect(story.quote.fr).toBeTruthy();
      expect(story.quote.ar).toBeTruthy();
    }
  });

  it('correctly manages document direction (RTL for Arabic, LTR for French & English)', () => {
    updateHtmlDirAndLang('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');

    updateHtmlDirAndLang('fr');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('fr');

    updateHtmlDirAndLang('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
  });
});
