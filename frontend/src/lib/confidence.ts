import { ConfidenceLevel } from '@/types/domain';

const CONFIDENCE_HIGH = Number(import.meta.env.VITE_CONFIDENCE_HIGH || 0.85);
const CONFIDENCE_THRESHOLD = Number(import.meta.env.VITE_CONFIDENCE_THRESHOLD || 0.70);

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= CONFIDENCE_HIGH) return 'high';
  if (score >= CONFIDENCE_THRESHOLD) return 'medium';
  return 'low';
}

export function formatConfidencePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}
