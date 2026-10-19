import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Info,
  HeartHandshake,
  Compass,
  Users,
  Target,
  Sparkles,
  MessageSquare,
  Play,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { VOCAB_SIZE } from '@/data/vocabulary.config';
import { useDemoStore } from '@/stores/demoStore';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { startDemo } = useDemoStore();

  useEffect(() => {
    document.title = `${t('nav.about', 'About')} | ${t('app.name', 'ConnectSign')}`;
  }, [t]);

  const handleStartDemo = () => {
    startDemo('pharmacy_headache');
    navigate('/app/new?mode=two_way&demo=true');
  };

  return (
    <div className="flex flex-col min-h-full bg-app-bg text-app-text">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Header Hero */}
        <div className="flex items-center gap-4 pb-2 border-b border-app-border">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-2 border border-teal-500/20 bg-[#0F2229] p-1">
            <img src="/icons/logo-mark.png" alt="ConnectSign Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {t('about.title', 'About ConnectSign')}
            </h1>
            <p className="text-sm font-semibold text-app-primary-strong">
              {t('app.tagline', 'Every Hand Has a Voice.')}
            </p>
          </div>
        </div>

        {/* 1. Mission & Vision Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card p={20} className="space-y-2.5 bg-app-surface border border-app-border shadow-1">
            <div className="flex items-center gap-2 text-app-primary-strong font-bold text-base">
              <Target className="w-5 h-5 shrink-0" />
              <h3>{t('about.missionTitle', 'Mission & Purpose')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
              {t('about.missionText')}
            </p>
          </Card>

          <Card p={20} className="space-y-2.5 bg-app-surface border border-app-border shadow-1">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-base">
              <Compass className="w-5 h-5 shrink-0" />
              <h3>{t('about.visionTitle', 'Vision & Impact')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
              {t('about.visionText')}
            </p>
          </Card>
        </div>

        {/* 2. Communication Barriers & Algerian Sign Language Context */}
        <Card p={24} className="space-y-4 bg-app-surface border border-app-border shadow-1">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-app-text flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-app-primary-strong" />
              <span>{t('about.barriersTitle', 'Communication Barriers Addressed')}</span>
            </h3>
            <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
              {t('about.barriersText')}
            </p>
          </div>

          <div className="pt-3 border-t border-app-border space-y-2">
            <h4 className="text-sm font-bold text-app-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-app-primary-strong" />
              <span>{t('about.lsaRoleTitle', 'Role of Algerian Sign Language (LSA)')}</span>
            </h4>
            <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
              {t('about.lsaRoleText')}
            </p>
          </div>

          <div className="pt-3 border-t border-app-border space-y-2">
            <h4 className="text-sm font-bold text-app-text flex items-center gap-2">
              <Users className="w-4 h-4 text-app-primary-strong" />
              <span>{t('about.audienceTitle', 'Intended Community & Users')}</span>
            </h4>
            <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
              {t('about.audienceText')}
            </p>
          </div>
        </Card>

        {/* 3. Bidirectional Architecture Pipeline */}
        <Card p={24} className="space-y-4 bg-app-surface border border-app-border shadow-1">
          <h3 className="text-base font-bold text-app-text flex items-center gap-2">
            <Info className="w-5 h-5 text-app-primary-strong" />
            <span>{t('about.howItWorksTitle', 'How does it work?')}</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-control bg-app-surface-2 border border-app-border space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-app-primary-strong">
                {t('about.pipelineLsaToLang', 'LSA (Sign) → Spoken Language (5 steps)')}
              </h4>
              <p className="text-xs text-app-muted leading-relaxed font-mono">
                {t('about.signToLangStep')}
              </p>
            </div>

            <div className="p-4 rounded-control bg-app-surface-2 border border-app-border space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-app-primary-strong">
                {t('about.pipelineLangToLsa', 'Spoken Language → LSA (4 steps)')}
              </h4>
              <p className="text-xs text-app-muted leading-relaxed font-mono">
                {t('about.langToSignStep')}
              </p>
            </div>
          </div>
        </Card>

        {/* 4. Honest MVP Limitations */}
        <Card p={24} className="space-y-3 bg-app-surface border border-app-border shadow-1">
          <h3 className="text-base font-bold text-app-text flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-app-warning" />
            <span>{t('about.limitationsTitle', 'What you should know')}</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-app-muted leading-relaxed">
            <li>{t('about.limitationMvp', { count: VOCAB_SIZE })}</li>
            <li>{t('about.limitationInterpreter')}</li>
            <li>{t('about.limitationDiagnosis')}</li>
          </ul>
        </Card>

        {/* 5. Privacy Summary */}
        <Card p={24} className="space-y-2.5 bg-app-surface border border-app-border shadow-1">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <h3>{t('about.privacyTitle', 'Guaranteed Local Privacy')}</h3>
          </div>
          <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
            {t('about.privacyText')}
          </p>
        </Card>

        {/* 6. Calls to Action */}
        <Card p={24} className="space-y-4 bg-app-surface-2 border border-app-border shadow-1">
          <h3 className="text-sm font-bold text-app-text">
            {t('about.ctaTitle', 'Explore ConnectSign')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="primary"
              size="md"
              iconStart={<MessageSquare className="w-4 h-4" />}
              onClick={() => navigate('/app/new')}
            >
              {t('about.ctaStartConv', 'Start a Conversation')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              iconStart={<Play className="w-4 h-4" />}
              onClick={handleStartDemo}
            >
              {t('about.ctaTryDemo', 'Try Pharmacy Demo')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              iconStart={<BookOpen className="w-4 h-4" />}
              onClick={() => navigate('/app/phrasebook')}
            >
              {t('about.ctaPhrasebook', 'Browse Phrasebook')}
            </Button>
          </div>
        </Card>

        {/* Medical Disclaimer & Version */}
        <div className="p-4 rounded-card bg-amber-50 dark:bg-amber-950/40 border border-app-warning/30 text-xs text-app-warning leading-relaxed space-y-1.5">
          <p className="font-semibold">{t('disclaimer')}</p>
          <p className="font-mono text-[11px] text-app-muted">
            {t('about.version', { version: import.meta.env.VITE_APP_VERSION || '0.1.0' })}
          </p>
        </div>
      </div>
    </div>
  );
};
