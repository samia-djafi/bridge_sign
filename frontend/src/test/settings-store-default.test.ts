import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore, PRODUCTION_RENDER_AI_URL } from '@/stores/settingsStore';
import { registry } from '@/services/registry';
import { HttpSignRecognitionAdapter } from '@/services/adapters/http/sign-recognition.http';

describe('Render AI Default Configuration & Settings Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.getState().resetSettings();
    vi.restoreAllMocks();
  });

  it('selects Render AI (http) and the Render URL by default', () => {
    const { settings } = useSettingsStore.getState();
    expect(settings.ai.adapter).toBe('http');
    expect(settings.ai.apiBaseUrl).toBe(PRODUCTION_RENDER_AI_URL);
    expect(settings.ai.apiBaseUrl).toBe('https://connect-sign.onrender.com');

    // Registry should have active adapter live pointing to http recognition
    expect(registry.ai.adapter).toBe('live');
  });

  it('preserves user custom AI configuration across state updates', () => {
    const { updateSettings } = useSettingsStore.getState();

    updateSettings({
      ai: {
        adapter: 'mock',
        apiBaseUrl: 'https://custom-ai.example.com',
        threshold: 0.8,
      },
    });

    const updated = useSettingsStore.getState().settings;
    expect(updated.ai.adapter).toBe('mock');
    expect(updated.ai.apiBaseUrl).toBe('https://custom-ai.example.com');
    expect(registry.ai.adapter).toBe('demo');

    // Check localStorage persistence
    const raw = localStorage.getItem('connectsign.settings.v1');
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw!);
    expect(stored.ai.adapter).toBe('mock');
    expect(stored.ai.apiBaseUrl).toBe('https://custom-ai.example.com');
  });

  it('HttpSignRecognitionAdapter defaults to Render AI URL and normalizes trailing slashes', () => {
    const adapter = new HttpSignRecognitionAdapter();
    expect((adapter as any).baseUrl).toBe('https://connect-sign.onrender.com');

    adapter.setBaseUrl('https://connect-sign.onrender.com///');
    expect((adapter as any).baseUrl).toBe('https://connect-sign.onrender.com');
  });

  it('HttpSignRecognitionAdapter executes POST to /v1/recognize with Render URL', async () => {
    const adapter = new HttpSignRecognitionAdapter('https://connect-sign.onrender.com');
    await adapter.start({ lang: 'fr' });
    adapter.push({ image: 'data:image/jpeg;base64,sample' });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        signs: [{ gloss: 'PAIN', confidence: 0.95, level: 'high', atMs: 120 }],
        sequence: ['PAIN'],
        overallConfidence: 0.95,
        level: 'high',
        frames: 1,
        adapter: 'live',
      }),
    });
    globalThis.fetch = mockFetch;

    const res = await adapter.finalize();
    expect(res.sequence).toEqual(['PAIN']);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://connect-sign.onrender.com/v1/recognize',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
});
