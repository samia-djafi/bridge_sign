import { SpokenLang } from '@/types/domain';
import { SpeechService, Voice } from '@/types/services';

const LANG_MAP: Record<SpokenLang, string[]> = {
  fr: ['fr-FR', 'fr'],
  ar: ['ar-DZ', 'ar-SA', 'ar'],
  en: ['en-US', 'en-GB', 'en'],
};

class BrowserSpeechService implements SpeechService {
  private activeRecognition: any = null;

  stt = {
    isSupported: (): boolean => {
      if (typeof window === 'undefined') return false;
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },

    start: (opts: {
      lang: SpokenLang;
      onInterim: (text: string) => void;
      onFinal: (text: string) => void;
      onError: (err: string) => void;
    }) => {
      if (!this.stt.isSupported()) {
        opts.onError('MIC-002');
        return;
      }

      this.stt.stop();

      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = LANG_MAP[opts.lang][0] || 'fr-FR';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        if (interim) {
          opts.onInterim(interim);
        }
        if (final) {
          opts.onFinal(final);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          opts.onError('MIC-001');
        } else if (event.error !== 'no-speech') {
          opts.onError(event.error || 'MIC-099');
        }
      };

      recognition.onend = () => {
        this.activeRecognition = null;
      };

      this.activeRecognition = recognition;
      try {
        recognition.start();
      } catch (err) {
        opts.onError('MIC-099');
      }
    },

    stop: () => {
      if (this.activeRecognition) {
        try {
          this.activeRecognition.stop();
        } catch {
          // Ignore error on stop
        }
        this.activeRecognition = null;
      }
    },
  };

  tts = {
    isSupported: (): boolean => {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    },

    speak: async (opts: {
      text: string;
      lang: SpokenLang;
      rate?: number;
      volume?: number;
      voiceId?: string;
    }): Promise<void> => {
      if (!this.tts.isSupported() || !opts.text) return;

      window.speechSynthesis.cancel();

      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(opts.text);
        utterance.rate = opts.rate ?? 1.0;
        utterance.volume = opts.volume ?? 1.0;

        const supportedLocales = LANG_MAP[opts.lang];
        utterance.lang = supportedLocales[0] || 'fr-FR';

        const voices = window.speechSynthesis.getVoices();
        if (opts.voiceId) {
          const v = voices.find((voice) => voice.name === opts.voiceId);
          if (v) utterance.voice = v;
        } else {
          // Match by language prefix
          const v = voices.find((voice) => supportedLocales.some((l) => voice.lang.toLowerCase().startsWith(l.toLowerCase())));
          if (v) utterance.voice = v;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      });
    },

    stop: () => {
      if (this.tts.isSupported()) {
        window.speechSynthesis.cancel();
      }
    },
  };

  voicesFor(lang: SpokenLang): Voice[] {
    if (!this.tts.isSupported()) return [];
    const voices = window.speechSynthesis.getVoices();
    const codes = LANG_MAP[lang];

    return voices
      .filter((v) => codes.some((code) => v.lang.toLowerCase().startsWith(code.toLowerCase())))
      .map((v) => ({
        id: v.name,
        name: v.name,
        lang: v.lang,
        isDefault: v.default,
      }));
  }
}

export const speechService = new BrowserSpeechService();
