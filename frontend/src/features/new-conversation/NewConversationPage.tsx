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
import { ContextId, SessionMode, SpokenLang } from '@/types/domain';
import { ArrowLeftRight, Camera, Mic, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

  // Accurate sensor permission inspection without triggering getUserMedia
  type SensorStatus = 'pending_start' | 'granted' | 'denied' | 'unsupported' | 'not_needed';
  const [camStatus, setCamStatus] = useState<SensorStatus>('pending_start');
  const [micStatus, setMicStatus] = useState<SensorStatus>('pending_start');

  useEffect(() => {
    let isMounted = true;

    async function checkSensors() {
      const needsCam = mode === 'two_way' || mode === 'sign_to_language';
      const needsMic = mode === 'two_way' || mode === 'language_to_sign';

      if (!needsCam) {
        setCamStatus('not_needed');
      } else if (!navigator.mediaDevices) {
        setCamStatus('unsupported');
      } else if ('permissions' in navigator && navigator.permissions.query) {
        try {
          const res = await navigator.permissions.query({ name: 'camera' as any });
          if (isMounted) {
            setCamStatus(res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'pending_start');
          }
        } catch {
          if (isMounted) setCamStatus('pending_start');
        }
      } else {
        setCamStatus('pending_start');
      }

      if (!needsMic) {
        setMicStatus('not_needed');
      } else if (!navigator.mediaDevices) {
        setMicStatus('unsupported');
      } else if ('permissions' in navigator && navigator.permissions.query) {
        try {
          const res = await navigator.permissions.query({ name: 'microphone' as any });
          if (isMounted) {
            setMicStatus(res.state === 'granted' ? 'granted' : res.state === 'denied' ? 'denied' : 'pending_start');
          }
        } catch {
          if (isMounted) setMicStatus('pending_start');
        }
      } else {
        setMicStatus('pending_start');
      }
    }

    checkSensors();
    return () => {
      isMounted = false;
    };
  }, [mode]);

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
      <div className="p-3 sm:p-5 lg:p-7 max-w-5xl w-full mx-auto">
        <form onSubmit={handleStart} className="space-y-4 sm:space-y-5">
          <Card p={20} className="bg-app-surface border border-app-border shadow-2 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-app-text">
                {t('newConv.title', 'Nouvelle conversation')}
              </h2>
              <p className="text-xs text-app-muted mt-0.5">
                Configurez l'environnement avant de commencer l'échange.
              </p>
            </div>

            {/* 1. Context & Title in responsive desktop grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              <div className="min-w-0 w-full space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-app-muted">
                  {t('newConv.contextLabel', "Contexte de l'échange")}
                </label>
                <ContextSelector value={context} onChange={setContext} />
              </div>

              <div className="w-full min-w-0">
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
                  placeholder={t('newConv.titlePlaceholder', 'ex. Pharmacie - Mardi')}
                  className="w-full h-11 px-3.5 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
                />
              </div>
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

            {/* 5. Readiness Checklist (Accurate Sensor Inspection) */}
            <div className="p-3.5 rounded-control bg-app-surface-2 border border-app-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-app-muted uppercase tracking-wider">
                  Capteurs requis au démarrage
                </span>
                <span className="text-[11px] text-app-muted">Initialisation au lancement</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-app-text">
                {/* Camera Status */}
                <span className="inline-flex items-center gap-1.5 font-medium">
                  {camStatus === 'denied' ? (
                    <AlertTriangle className="w-4 h-4 text-app-error" />
                  ) : camStatus === 'granted' ? (
                    <CheckCircle2 className="w-4 h-4 text-app-success" />
                  ) : (
                    <Camera className="w-4 h-4 text-app-muted" />
                  )}
                  <span className={camStatus === 'denied' ? 'text-app-error font-semibold' : ''}>
                    {camStatus === 'not_needed'
                      ? 'Caméra : non requise pour ce mode'
                      : camStatus === 'denied'
                      ? 'Accès caméra bloqué (autoriser dans le navigateur)'
                      : camStatus === 'unsupported'
                      ? 'Caméra : non supportée sur cette connexion'
                      : camStatus === 'granted'
                      ? 'Caméra : autorisation accordée'
                      : 'Caméra requise au démarrage'}
                  </span>
                </span>

                {/* Microphone Status */}
                <span className="inline-flex items-center gap-1.5 font-medium">
                  {micStatus === 'denied' ? (
                    <AlertTriangle className="w-4 h-4 text-app-error" />
                  ) : micStatus === 'granted' ? (
                    <CheckCircle2 className="w-4 h-4 text-app-success" />
                  ) : (
                    <Mic className="w-4 h-4 text-app-muted" />
                  )}
                  <span className={micStatus === 'denied' ? 'text-app-error font-semibold' : ''}>
                    {micStatus === 'not_needed'
                      ? 'Microphone : non requis pour ce mode'
                      : micStatus === 'denied'
                      ? 'Accès micro bloqué (autoriser dans le navigateur)'
                      : micStatus === 'unsupported'
                      ? 'Microphone : non supporté'
                      : micStatus === 'granted'
                      ? 'Microphone : autorisation accordée'
                      : 'Microphone requis au démarrage'}
                  </span>
                </span>

                {/* AI Model Status */}
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-app-primary-strong" />
                  <span>
                    Modèle IA ({registry.ai.adapter === 'demo' ? 'Mode Démo' : 'Mode Direct'})
                  </span>
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
