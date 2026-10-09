import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { ContextSelector } from '@/components/domain/ContextSelector';
import { LanguageSelector } from '@/components/domain/LanguageSelector';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBar } from '@/components/domain/StatusBar';
import { ContextId, SessionMode, SpokenLang } from '@/types/domain';
import { ArrowLeftRight, Camera, Mic, Sparkles } from 'lucide-react';
import { registry } from '@/services/registry';

export const NewConversationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startSession } = useSessionStore();
  const { settings, updateSettings } = useSettingsStore();

  const initialMode = (searchParams.get('mode') as SessionMode) || settings.lastMode || 'two_way';
  const initialPhrase = searchParams.get('phrase');

  const [context, setContext] = useState<ContextId>(settings.lastContext || 'healthcare');
  const [spokenLang, setSpokenLang] = useState<SpokenLang>(settings.defaultSpokenLang || 'fr');
  const [mode, setMode] = useState<SessionMode>(initialMode);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `${t('nav.newConversation')} — ${t('app.name')}`;
  }, [t]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const autoTitle = title.trim() || `${t(`contexts.${context}`)} · ${timeStr}`;

    updateSettings({
      lastContext: context,
      lastMode: mode,
      defaultSpokenLang: spokenLang,
    });

    const sessionId = await startSession({
      title: autoTitle,
      context,
      signLanguage: 'LSA',
      spokenLang,
      mode,
    });

    const query = initialPhrase ? `?phrase=${initialPhrase}` : '';
    navigate(`/app/workspace/${sessionId}${query}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.newConversation', 'Nouvelle conversation')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
        <form onSubmit={handleStart} className="space-y-6">
          <Card p={24} className="bg-app-surface border border-app-border shadow-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-app-text">
                {t('newConv.title', 'Nouvelle conversation')}
              </h2>
              <p className="text-xs text-app-muted mt-1">
                Configurez l'environnement avant de commencer l'échange.
              </p>
            </div>

            {/* 1. Context */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-app-muted">
                {t('newConv.contextLabel', "Contexte de l'échange")}
              </label>
              <ContextSelector value={context} onChange={setContext} />
            </div>

            {/* 2. Spoken Language & 3. Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-app-muted">
                  {t('newConv.langLabel', 'Langue parlée')}
                </label>
                <LanguageSelector value={spokenLang} onChange={setSpokenLang} />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-app-muted">
                  {t('newConv.modeLabel', 'Mode de départ')}
                </label>
                <SegmentedControl
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'two_way', label: 'Double sens' },
                    { value: 'sign_to_language', label: 'LSA → Langue' },
                    { value: 'language_to_sign', label: 'Langue → LSA' },
                  ]}
                  className="w-full"
                />
              </div>
            </div>

            {/* 4. Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="session-title"
                className="block text-xs font-bold uppercase tracking-wider text-app-muted"
              >
                {t('newConv.titleLabel', 'Titre de la session (facultatif)')}
              </label>
              <input
                id="session-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('newConv.titlePlaceholder', 'ex. Pharmacie — Mardi')}
                className="w-full h-11 px-3.5 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
              />
            </div>

            {/* 5. Readiness Checklist (Non-blocking) */}
            <div className="p-3.5 rounded-control bg-app-surface-2 border border-app-border space-y-2 text-xs">
              <span className="font-semibold text-app-muted uppercase tracking-wider">
                État des capteurs
              </span>
              <div className="flex flex-wrap items-center gap-4 text-app-text">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Camera className="w-4 h-4 text-app-primary-strong" />
                  <span>Caméra prête</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Mic className="w-4 h-4 text-app-primary-strong" />
                  <span>Microphone prêt</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-app-primary-strong" />
                  <span>Modèle IA ({registry.ai.adapter === 'demo' ? 'Démo' : 'Direct'})</span>
                </span>
              </div>
            </div>

            {/* Actions: Start & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-app-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/app')}
              >
                {t('newConv.cancelAction', 'Annuler')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconEnd={<ArrowLeftRight className="w-4 h-4" />}
              >
                {t('newConv.startAction', 'Démarrer la conversation')}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
