import React from 'react';
import { useDemoStore } from '@/stores/demoStore';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SpokenLang } from '@/types/domain';

export const DemoCoach: React.FC<{ spokenLang?: SpokenLang }> = ({ spokenLang = 'fr' }) => {
  const { t } = useTranslation();
  const { isDemoActive, currentScenario, currentStepIndex, getCurrentStep, nextStep, exitDemo } =
    useDemoStore();

  if (!isDemoActive || !currentScenario) return null;

  const currentStep = getCurrentStep();
  if (!currentStep) return null;

  const totalSteps = currentScenario.steps.length;
  const instruction = currentStep.coachInstruction[spokenLang] || currentStep.coachInstruction.fr;

  return (
    <div
      role="region"
      aria-label="Coach de démonstration"
      className="p-3.5 rounded-card bg-app-surface border-2 border-app-primary-strong shadow-2 flex flex-col gap-2.5 animate-slide-up select-none my-3"
    >
      <div className="flex items-center justify-between gap-2 border-b border-app-primary-strong/20 pb-2">
        <div className="flex items-center gap-2 text-app-primary-strong font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            {t('badge.demo', 'Mode Démo')} · Étape {currentStepIndex} sur {totalSteps}
          </span>
        </div>

        <button
          type="button"
          onClick={exitDemo}
          aria-label="Quitter la démonstration"
          className="text-xs text-app-muted hover:text-app-text font-medium flex items-center gap-1"
        >
          <span>Quitter</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-sm font-semibold text-app-text leading-snug">{instruction}</p>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-app-muted">
          {currentStep.targetSide === 'sign' ? '🤟 Côté LSA (Signe)' : '🗣️ Côté Parole (Entendant)'}
        </span>

        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-control bg-app-primary-strong text-white hover:bg-app-primary-hover text-xs font-semibold shadow-1 transition-colors"
        >
          <span>{currentStepIndex === totalSteps ? 'Terminer' : 'Suivant'}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
};
