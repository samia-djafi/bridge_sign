import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDemoStore } from '@/stores/demoStore';
import { registry } from '@/services/registry';
import { ConversationSession, Phrase } from '@/types/domain';
import { StatusBar } from '@/components/domain/StatusBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PhraseCard } from '@/components/domain/PhraseCard';
import { InstallCard } from '@/components/domain/InstallCard';
import {
  ArrowLeftRight,
  Play,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/time';

export const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentSession, status, endSession, startSession } = useSessionStore();
  const { settings } = useSettingsStore();
  const { startDemo } = useDemoStore();

  const [recentSessions, setRecentSessions] = useState<ConversationSession[]>([]);
  const [quickPhrases, setQuickPhrases] = useState<Phrase[]>([]);
  const [showLimits, setShowLimits] = useState(false);

  useEffect(() => {
    document.title = `${t('nav.dashboard')} — ${t('app.name')}`;

    async function loadData() {
      try {
        const list = await registry.sessions.list();
        setRecentSessions(list.slice(0, 5));

        const phrases = await registry.phrasebook.list();
        setQuickPhrases(phrases.slice(0, 4));
      } catch {
        // ignore
      }
    }
    loadData();
  }, [t]);

  // Greeting by hour
  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? 'dash.greetingMorning'
      : hour < 18
      ? 'dash.greetingAfternoon'
      : 'dash.greetingEvening';

  const hasActiveSession = currentSession && (status === 'active' || status === 'paused');

  const handleStartDemo = () => {
    startDemo('pharmacy_headache');
    navigate('/app/new?mode=two_way&demo=true');
  };

  const handleQuickPhraseSend = async (phrase: Phrase) => {
    let sessId = currentSession?.id;
    if (!sessId || status === 'ended') {
      sessId = await startSession({
        title: `Pharmacie · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        context: 'healthcare',
        signLanguage: 'LSA',
        spokenLang: settings.defaultSpokenLang,
        mode: 'two_way',
      });
    }

    navigate(`/app/workspace/${sessId}?phrase=${phrase.id}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.dashboard', 'Accueil')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Block & Readiness Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text">
              {t(greetingKey)}, {t('dash.ready', 'Prêt à communiquer ?')}
            </h2>
            <p className="text-sm text-app-muted mt-1">
              {t('app.tagline', 'Deux modalités. Une seule conversation.')}
            </p>
          </div>

          {/* Readiness Chips Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-app-surface border border-app-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('dash.cameraStatus', 'Caméra')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-app-surface border border-app-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('dash.micStatus', 'Micro')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-app-surface border border-app-border">
              <span className="w-2 h-2 rounded-full bg-app-primary-strong" />
              <span>
                {registry.ai.adapter === 'demo' ? t('badge.demo', 'Démo') : t('badge.live', 'IA Direct')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-app-surface border border-app-border">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('dash.offlineStatus', 'Hors-ligne ✓')}</span>
            </span>
          </div>
        </div>

        {/* Resume Card (if active session exists) */}
        {hasActiveSession && (
          <div className="p-4 rounded-card bg-app-primary-soft border-2 border-app-primary-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-app-primary-strong text-white flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-app-primary-strong">
                  Conversation en cours
                </p>
                <h3 className="font-bold text-base text-app-text">{currentSession.title}</h3>
                <p className="text-xs text-app-muted">
                  {currentSession.messageCount || 0} messages · {status === 'paused' ? 'En pause' : 'Active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => endSession()}
              >
                {t('dash.end', 'Terminer')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/app/workspace/${currentSession.id}`)}
              >
                {t('dash.resume', 'Reprendre')}
              </Button>
            </div>
          </div>
        )}

        {/* 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Action Card: Two-Way Conversation */}
            <Card
              interactive
              p={24}
              onClick={() => navigate('/app/new?mode=two_way')}
              className="bg-app-surface border border-app-primary-strong/30 hover:border-app-primary-strong shadow-2 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-app-primary-strong text-white flex items-center justify-center shrink-0 shadow-1 group-hover:scale-105 transition-transform">
                    <ArrowLeftRight className="w-7 h-7" />
                  </div>
                  <div>
                    <Badge variant="demo" size="sm" className="mb-1.5">
                      Mode principal recommandé
                    </Badge>
                    <h3 className="text-xl font-bold text-app-text">
                      {t('dash.startTwoWay', 'Démarrer une conversation à double sens')}
                    </h3>
                    <p className="text-sm text-app-muted mt-1 max-w-md">
                      {t(
                        'dash.startTwoWaySub',
                        'Les deux personnes communiquent au même endroit en alternant signes et parole.'
                      )}
                    </p>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="shrink-0 pointer-events-none">
                  {t('dash.start', 'Démarrer')}
                </Button>
              </div>
            </Card>

            {/* Secondary Actions Row: 2-Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                interactive
                p={20}
                onClick={() => navigate('/app/sign-to-language')}
                className="hover:border-app-primary-strong"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-control bg-app-surface-2 text-app-primary-strong flex items-center justify-center shrink-0">
                    <span className="text-xl select-none" aria-hidden="true">
                      🤟
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-app-text">
                      {t('mode.signToLang', 'LSA → Langue')}
                    </h4>
                    <p className="text-xs text-app-muted mt-0.5">
                      Signez à la caméra et transmettez votre voix/texte
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                interactive
                p={20}
                onClick={() => navigate('/app/language-to-sign')}
                className="hover:border-app-primary-strong"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-control bg-app-surface-2 text-app-primary-strong flex items-center justify-center shrink-0">
                    <span className="text-xl select-none" aria-hidden="true">
                      🗣️
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-app-text">
                      {t('mode.langToSign', 'Langue → LSA')}
                    </h4>
                    <p className="text-xs text-app-muted mt-0.5">
                      Écrivez ou dictez pour jouer les signes LSA
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Conversations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-app-text">
                  {t('dash.recentConversations', 'Conversations récentes')}
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/app/history')}
                  className="text-xs font-semibold text-app-primary-strong hover:underline"
                >
                  Voir tout
                </button>
              </div>

              {recentSessions.length === 0 ? (
                <div className="p-6 rounded-card bg-app-surface border border-app-border text-center text-xs text-app-muted">
                  {t('dash.noConversations', 'Aucune conversation pour le moment.')}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => navigate(`/app/history/${session.id}`)}
                      className="w-full p-3.5 rounded-card bg-app-surface border border-app-border hover:border-app-border-strong hover:shadow-1 flex items-center justify-between gap-4 text-start transition-all"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-control bg-app-surface-2 flex items-center justify-center shrink-0 text-app-muted">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-app-text truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-app-muted">
                            {session.messageCount || 0} messages · {session.spokenLang.toUpperCase()} ↔ LSA
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-app-muted font-mono">
                          {formatRelativeTime(session.startedAt, i18n.resolvedLanguage)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-app-muted rtl:-scale-x-100" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Try the Pharmacy Demo Card */}
            <div className="p-5 rounded-card bg-gradient-to-br from-app-surface to-app-primary-soft border border-app-primary-strong/20 shadow-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-app-primary-strong flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Démonstration interactive</span>
                </span>
                <Badge variant="demo" size="sm">
                  Démo
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm text-app-text">
                  {t('dash.tryDemo', 'Essayer la démonstration pharmacie')}
                </h4>
                <p className="text-xs text-app-muted mt-1 leading-relaxed">
                  Scénario interactif sans caméra ni micro requis pour découvrir le dialogue complet.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                iconStart={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={handleStartDemo}
              >
                Lancer la démo pharmacie
              </Button>
            </div>

            {/* Quick Phrases Widget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-app-text">
                  {t('dash.quickPhrases', 'Phrases rapides')}
                </h4>
                <button
                  type="button"
                  onClick={() => navigate('/app/phrasebook')}
                  className="text-xs font-semibold text-app-primary-strong hover:underline"
                >
                  Dictionnaire
                </button>
              </div>

              <div className="space-y-2">
                {quickPhrases.map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    onSendToConversation={handleQuickPhraseSend}
                  />
                ))}
              </div>
            </div>

            {/* PWA Install Card (Conditional) */}
            <InstallCard />

            {/* Limitations Collapsible Info Card */}
            <div className="p-4 rounded-card bg-app-surface border border-app-border text-xs text-app-muted space-y-2">
              <button
                type="button"
                onClick={() => setShowLimits(!showLimits)}
                className="w-full flex items-center justify-between font-semibold text-app-text"
              >
                <div className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-app-primary-strong" />
                  <span>{t('dash.limitationsTitle', "Rappel d'usage")}</span>
                </div>
                {showLimits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showLimits && (
                <p className="leading-relaxed animate-fade-in pt-1">
                  {t('dash.limitationsText')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
