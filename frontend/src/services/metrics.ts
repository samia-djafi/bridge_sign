import { ModelMetrics } from '@/types/domain';
import { MetricsService } from '@/types/services';
import { VOCAB_SIZE } from '@/data/vocabulary.config';

class AppMetricsService implements MetricsService {
  private metrics: ModelMetrics = {
    fps: 0,
    inferenceMs: null,
    vocabSize: VOCAB_SIZE,
    tracking: 'lost',
    adapter: 'demo',
    model: 'LSA-Sequence-TCN-Lite',
    version: '0.1.0-mvp',
  };

  private listeners: ((m: ModelMetrics) => void)[] = [];

  getMetrics(): ModelMetrics {
    return { ...this.metrics };
  }

  updateMetrics(partial: Partial<ModelMetrics>): void {
    this.metrics = { ...this.metrics, ...partial };
    this.notify();
  }

  subscribe(callback: (metrics: ModelMetrics) => void): () => void {
    this.listeners.push(callback);
    callback({ ...this.metrics });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.metrics });
    }
  }
}

export const metricsService = new AppMetricsService();
