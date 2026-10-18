import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();

  if (typeof (window as any).SpeechSynthesisUtterance === 'undefined') {
    class MockSpeechSynthesisUtterance {
      text: string;
      lang = '';
      voice: any = null;
      rate = 1.0;
      volume = 1.0;
      pitch = 1.0;
      onend: ((e: any) => void) | null = null;
      onerror: ((e: any) => void) | null = null;

      constructor(text = '') {
        this.text = text;
      }
    }
    (window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    (globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  }
}

