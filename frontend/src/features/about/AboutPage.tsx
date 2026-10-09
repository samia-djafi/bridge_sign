import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from '@/components/domain/StatusBar';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Info, HeartHandshake } from 'lucide-react';
import { VOCAB_SIZE } from '@/data/vocabulary.config';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.about', 'À propos')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-app-primary-strong flex items-center justify-center shrink-0 shadow-2">
            <img src="/icons/logo-mark.svg" alt="" className="w-9 h-9 invert" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-app-text">LSA Bridge</h2>
            <p className="text-sm font-semibold text-app-primary-strong">
              {t('app.tagline', 'Deux modalités. Une seule conversation.')}
            </p>
          </div>
        </div>

        {/* 1. Why LSA Bridge */}
        <Card p={24} className="space-y-3">
          <h3 className="text-lg font-bold text-app-text flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-app-primary-strong" />
            <span>{t('about.whyTitle', 'Pourquoi LSA Bridge ?')}</span>
          </h3>
          <p className="text-sm text-app-muted leading-relaxed">
            {t(
              'about.whyText',
              "En Algérie, les personnes sourdes se heurtent quotidiennement à des barrières de communication lors de consultations médicales ou de démarches administratives en l'absence d'interprète qualifié. LSA Bridge sert de pont d'appoint d'urgence."
            )}
          </p>
        </Card>

        {/* 2. How It Works SVG Diagrams */}
        <Card p={24} className="space-y-5">
          <h3 className="text-lg font-bold text-app-text flex items-center gap-2">
            <Info className="w-5 h-5 text-app-primary-strong" />
            <span>{t('about.howItWorksTitle', 'Comment ça fonctionne ?')}</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-control bg-app-surface-2 border border-app-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-app-primary-strong mb-2">
                LSA (Signe) → Langue parlée (5 étapes)
              </h4>
              <p className="text-xs text-app-muted leading-relaxed font-mono">
                {t('about.signToLangStep')}
              </p>
            </div>

            <div className="p-4 rounded-control bg-app-surface-2 border border-app-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-app-primary-strong mb-2">
                Langue parlée → LSA (4 étapes)
              </h4>
              <p className="text-xs text-app-muted leading-relaxed font-mono">
                {t('about.langToSignStep')}
              </p>
            </div>
          </div>
        </Card>

        {/* 3. What you should know & Honest limitations */}
        <Card p={24} className="space-y-3">
          <h3 className="text-lg font-bold text-app-text">
            {t('about.limitationsTitle', 'Ce que vous devez savoir')}
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-app-muted leading-relaxed">
            <li>
              <strong>Vocabulaire du MVP :</strong> Actuellement limité à {VOCAB_SIZE} signes LSA
              essentiels pour la santé et la vie quotidienne.
            </li>
            <li>
              <strong>Assistance à la communication :</strong> LSA Bridge ne remplace jamais un
              interprète assermenté.
            </li>
            <li>
              <strong>Aucun diagnostic :</strong> L’application formule les propos exprimés par la
              personne et ne produit aucun diagnostic médical.
            </li>
          </ul>
        </Card>

        {/* 4. Privacy Summary */}
        <Card p={24} className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold">Confidentialité garantie</h3>
          </div>
          <p className="text-xs text-app-muted leading-relaxed">
            {t('privacy.helpDesc')}
          </p>
        </Card>

        {/* Version & Pinned Medical Disclaimer */}
        <div className="p-4 rounded-card bg-amber-50 dark:bg-amber-950/40 border border-app-warning/30 text-xs text-app-warning leading-relaxed space-y-2">
          <p className="font-semibold">{t('disclaimer')}</p>
          <p className="font-mono text-[11px] text-app-muted">
            {t('about.version', { version: import.meta.env.VITE_APP_VERSION || '0.1.0' })}
          </p>
        </div>
      </div>
    </div>
  );
};
