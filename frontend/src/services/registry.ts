import { mockSignRecognitionAdapter } from './adapters/mock/sign-recognition.mock';
import { httpSignRecognitionAdapter } from './adapters/http/sign-recognition.http';
import { textToSignService } from './text-to-sign';
import { languageGenerationService } from './language-generation';
import { signAssetService } from './sign-assets';
import { speechService } from './speech';
import { sessionRepository } from './session-repository';
import { phrasebookService } from './phrasebook-service';
import { metricsService } from './metrics';
import { AiMode } from '@/types/domain';
import { SignRecognitionService } from '@/types/services';

class ServiceRegistry {
  private activeAiMode: 'mock' | 'http' = (import.meta.env.VITE_AI_ADAPTER as any) === 'http' ? 'http' : 'mock';

  setAiAdapter(mode: 'mock' | 'http', customBaseUrl?: string) {
    this.activeAiMode = mode;
    if (customBaseUrl) {
      httpSignRecognitionAdapter.setBaseUrl(customBaseUrl);
    }
    metricsService.updateMetrics({
      adapter: this.ai.adapter,
    });
  }

  get ai(): { recognition: SignRecognitionService; adapter: AiMode } {
    if (this.activeAiMode === 'http') {
      return {
        recognition: httpSignRecognitionAdapter,
        adapter: 'live',
      };
    }
    return {
      recognition: mockSignRecognitionAdapter,
      adapter: 'demo',
    };
  }

  get mockRecognition() {
    return mockSignRecognitionAdapter;
  }

  get textToSign() {
    return textToSignService;
  }

  get languageGeneration() {
    return languageGenerationService;
  }

  get signAssets() {
    return signAssetService;
  }

  get speech() {
    return speechService;
  }

  get sessions() {
    return sessionRepository;
  }

  get phrasebook() {
    return phrasebookService;
  }

  get metrics() {
    return metricsService;
  }
}

export const registry = new ServiceRegistry();
