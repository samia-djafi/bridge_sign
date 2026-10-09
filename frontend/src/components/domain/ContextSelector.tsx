import React from 'react';
import { ContextId } from '@/types/domain';
import { CONTEXTS } from '@/data/contexts';
import { HeartPulse, Building2, GraduationCap, ShoppingBag, MoreHorizontal, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ContextSelectorProps {
  value: ContextId;
  onChange: (id: ContextId) => void;
  className?: string;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();

  const getIcon = (id: ContextId) => {
    switch (id) {
      case 'healthcare':
        return <HeartPulse className="w-5 h-5 text-red-500" />;
      case 'administration':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'everyday':
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case 'other':
        return <MoreHorizontal className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {CONTEXTS.map((ctx) => {
          const isSelected = ctx.id === value;
          return (
            <button
              key={ctx.id}
              type="button"
              onClick={() => onChange(ctx.id)}
              className={`p-3 rounded-card text-start flex flex-col justify-between min-h-[88px] transition-all relative border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong select-none ${
                isSelected
                  ? 'bg-app-primary-soft border-2 border-app-primary-strong shadow-1 font-semibold'
                  : 'bg-app-surface border-app-border hover:border-app-border-strong hover:bg-app-surface-2'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {getIcon(ctx.id)}
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-app-primary-strong text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-app-text mt-2">{t(ctx.nameKey)}</p>
                <p className="text-[10px] text-app-muted truncate mt-0.5">{ctx.descriptionKey}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-app-muted">
        {t(
          'newConv.contextHelp',
          "Le contexte adapte les suggestions de phrases rapides. Il ne change pas le modèle IA."
        )}
      </p>
    </div>
  );
};
