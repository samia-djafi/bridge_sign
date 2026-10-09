import { LandmarkFrame, RecognitionResult, SpokenLang } from '@/types/domain';
import { SignRecognitionService } from '@/types/services';
import { SEED_PHRASES } from '@/data/phrasebook';
import { getConfidenceLevel } from '@/lib/confidence';

export class MockSignRecognitionAdapter implements SignRecognitionService {
  readonly adapter = 'demo' as const;
  private frames: LandmarkFrame[] = [];
  private phraseIndex = 0;
  private queuedResult: RecognitionResult | null = null;

  setScriptedResult(result: RecognitionResult | null) {
    this.queuedResult = result;
  }

  async start(_opts: { lang: SpokenLang }): Promise<void> {
    this.frames = [];
  }

  push(frame: LandmarkFrame): void {
    this.frames.push(frame);
  }

  async finalize(): Promise<RecognitionResult> {
    const frameCount = Math.max(12, this.frames.length);

    // If a scripted result is queued (from DemoScenario / SimulateSign), return it
    if (this.queuedResult) {
      const res = { ...this.queuedResult, frames: frameCount };
      this.queuedResult = null;
      this.frames = [];
      return res;
    }

    // Free mode: simulate realistic latency 250-500ms
    const latency = Math.floor(Math.random() * 250) + 250;
    await new Promise((resolve) => setTimeout(resolve, latency));

    // Cycle through a subset of common phrases
    const cyclePhrases = [
      SEED_PHRASES[0]!, // Headache
      SEED_PHRASES[1]!, // Pain
      SEED_PHRASES[2]!, // Fever
      SEED_PHRASES[8]!, // Need medicine
      SEED_PHRASES[14]!, // Appointment have
    ];

    const currentPhrase = cyclePhrases[this.phraseIndex % cyclePhrases.length]!;
    this.phraseIndex++;

    const baseConf = 0.92;
    const detectedSigns = currentPhrase.gloss.map((gloss, idx) => ({
      gloss,
      confidence: Math.min(0.98, baseConf + idx * 0.02),
      level: getConfidenceLevel(baseConf),
      atMs: idx * 800 + 400,
    }));

    this.frames = [];

    return {
      signs: detectedSigns,
      sequence: currentPhrase.gloss,
      overallConfidence: baseConf,
      level: 'high',
      frames: frameCount,
      latencyMs: latency,
      model: { name: 'LSA-Sequence-TCN-Lite', version: '0.1.0-mvp' },
      adapter: 'demo',
    };
  }

  reset(): void {
    this.frames = [];
    this.queuedResult = null;
  }
}

export const mockSignRecognitionAdapter = new MockSignRecognitionAdapter();
