import React from 'react';
import { Check, Minus, AlertTriangle } from 'lucide-react';
import { ConfidenceLevel } from '@/types/domain';
import { useTranslation } from 'react-i18next';

export interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  value?: number;
  showValue?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  level,
  value,
  showValue = false,
  className = '',
}) => {
  const { t } = useTranslation();

  const filledSegments = {
    high: 5,
    medium: 3,
    low: 1,
  }[level];

  const config = {
    high: {
      text: t('rec.confidenceHigh', 'Confiance élevée'),
      color: 'bg-app-primary-strong',
      textColor: 'text-app-primary-strong',
      icon: <Check className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    medium: {
      text: t('rec.confidenceMedium', 'Confiance moyenne'),
      color: 'bg-app-warning',
      textColor: 'text-app-warning',
      icon: <Minus className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    low: {
      text: t('rec.confidenceLow', 'Incertain'),
      color: 'bg-app-error',
      textColor: 'text-app-error',
      icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  }[level];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* 5-segment bar */}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((seg) => (
          <div
            key={seg}
            className={`w-1.5 h-3 rounded-sm transition-colors ${
              seg <= filledSegments ? config.color : 'bg-app-border'
            }`}
          />
        ))}
      </div>

      <div className={`inline-flex items-center gap-1 text-xs font-semibold ${config.textColor}`}>
        {config.icon}
        <span>{config.text}</span>
        {showValue && value !== undefined && (
          <span className="text-app-muted ms-1 font-mono font-normal">
            ({Math.round(value * 100)}%)
          </span>
        )}
      </div>
    </div>
  );
};
