import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProfileStore } from '@/stores/profileStore';
import { useDemoStore } from '@/stores/demoStore';
import { registry } from '@/services/registry';
import { ConversationSession, Phrase } from '@/types/domain';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { STORIES, Story } from '@/data/stories';
import {
  ArrowLeftRight,
  Sparkles,
  ChevronRight,
  Clock,
  Play,
  Pill,
  BookOpen,
  HeartHandshake,
  Quote,
  ChevronLeft,
  MessageSquarePlus,
  Send,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/time';

export const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentSession, status, endSession, startSession } = useSessionStore();
  const { settings } = useSettingsStore();
  const { preferredName } = useProfileStore();
  const { startDemo } = useDemoStore();

  const [recentSessions, setRecentSessions] = useState<ConversationSession[]>([]);
  const [quickPhrases, setQuickPhrases] = useState<Phrase[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const currentLang = (['fr', 'ar', 'en'].includes(i18n.language) ? i18n.language : 'fr') as
    | 'fr'
    | 'ar'
    | 'en';

  useEffect(() => {
    document.title = `${t('nav.dashboard', 'Accueil')} — ${t('app.name', 'BridgeSign')}`;

    async function loadData() {
      try {
        const list = await registry.sessions.list();
        setRecentSessions(list.slice(0, 5));

        const phrases = await registry.phrasebook.list();
        // Curate 4 clinical/pharmacy phrases
        const pharmacyPicks = phrases.filter((p) =>
          ['ph_headache', 'ph_prescription', 'ph_paracetamol', 'ph_thank_you'].includes(p.id)
        );
        setQuickPhrases(pharmacyPicks.length > 0 ? pharmacyPicks : phrases.slice(0, 4));
      } catch {
        // ignore
      }
    }
    loadData();
  }, [t]);

  // Greeting by time of day
  const hour = new Date().getHours();
  const greetingText =
    hour < 12
      ? t('dash.greetingMorning', 'Good morning')
      : hour < 18
      ? t('dash.greetingAfternoon', 'Good afternoon')
      : t('dash.greetingEvening', 'Good evening');

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

  const currentStory: Story | undefined = STORIES[activeStoryIndex];

  return (
    <div className="flex flex-col min-h-full bg-app-bg text-app-text">
      {/* Main Content Layout */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Welcome Hero Section with Hands Illustration */}
        <section aria-labelledby="welcome-heading">
          <div className="relative overflow-hidden rounded-card bg-app-surface border border-app-border-strong/60 shadow-1 p-5 sm:p-6">
            <div className="relative z-10 max-w-lg space-y-1.5">
              <h1 id="welcome-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-app-text">
                {preferredName ? (
                  <>
                    {greetingText}, <span className="text-app-primary-strong">{preferredName}</span>
                  </>
                ) : (
                  <span>{t('dash.welcomeGeneric', 'Welcome to BridgeSign.')}</span>
                )}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-app-text">
                Communication is a right, not a barrier.
              </p>
              <p className="text-xs text-app-muted">
                We're here to help you bridge the gap.
              </p>
            </div>

            {/* Illustration 1: Hands silhouette graphic */}
            <div className="pointer-events-none absolute end-0 inset-y-0 flex items-center justify-end overflow-hidden opacity-90 sm:opacity-100">
              <img
                src="/illustrations/welcome-hands.png"
                alt=""
                className="h-full max-h-36 sm:max-h-44 w-auto object-contain object-right"
              />
            </div>
          </div>
        </section>

        {/* Resume Banner (if active session exists) */}
        {hasActiveSession && (
          <div className="p-4 rounded-card bg-app-primary-soft border-2 border-app-primary-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-app-primary-strong text-white flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5 animate-pulse" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-app-primary-strong block">
                  Conversation en cours
                </span>
                <h2 className="font-bold text-sm sm:text-base text-app-text truncate">
                  {currentSession.title}
                </h2>
                <p className="text-xs text-app-muted">
                  {currentSession.messageCount || 0} messages · {status === 'paused' ? 'En pause' : 'Active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => endSession()}>
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

        {/* 12-Column Responsive Layout: Central Column (8 cols) + Right Column (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Central Column (lg:col-span-8) */}
          <main className="lg:col-span-8 space-y-8">
            {/* 1. Primary Two-Way Conversation Card */}
            <section aria-labelledby="primary-action-heading">
              <Card
                interactive
                p={24}
                onClick={() => navigate('/app/new?mode=two_way')}
                className="bg-app-surface border-2 border-app-primary-strong/40 hover:border-app-primary-strong shadow-2 group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-app-primary-strong text-white flex items-center justify-center shrink-0 shadow-2 group-hover:scale-105 transition-transform">
                      <ArrowLeftRight className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-app-primary-soft text-app-primary-strong text-[11px] font-bold uppercase tracking-wider">
                        Recommandé
                      </span>
                      <h2 id="primary-action-heading" className="text-xl sm:text-2xl font-extrabold text-app-text">
                        {t('dash.startTwoWay', 'Start a two-way conversation')}
                      </h2>
                      <p className="text-xs sm:text-sm text-app-muted leading-relaxed max-w-md">
                        {t('dash.startTwoWaySub', 'Both people communicate in one place.')}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="shrink-0 pointer-events-none group-hover:shadow-3"
                  >
                    {t('dash.start', 'Démarrer')}
                  </Button>
                </div>
              </Card>
            </section>

            {/* 2. Communication Mode Cards (Sign → Language & Language → Sign) */}
            <section aria-label="Modes de communication spécialisés" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Sign → Language */}
              <Card
                interactive
                p={20}
                onClick={() => navigate('/app/sign-to-language')}
                className="bg-app-surface border border-app-border hover:border-app-primary-strong transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-control bg-app-surface-2 text-app-primary-strong flex items-center justify-center shrink-0">
                    <span className="text-2xl select-none" role="img" aria-label="Langue des signes">
                      🤟
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-app-text">
                      {t('dash.signToLangTitle', 'Sign → Language')}
                    </h3>
                    <p className="text-xs text-app-muted leading-relaxed">
                      {t(
                        'dash.signToLangDesc',
                        'Sign in front of the camera to translate your signs into spoken and written words.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-app-border flex items-center justify-between text-xs text-app-primary-strong font-semibold">
                  <span>Signer devant la caméra</span>
                  <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                </div>
              </Card>

              {/* Card 2: Language → Sign */}
              <Card
                interactive
                p={20}
                onClick={() => navigate('/app/language-to-sign')}
                className="bg-app-surface border border-app-border hover:border-app-primary-strong transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-control bg-app-surface-2 text-app-primary-strong flex items-center justify-center shrink-0">
                    <span className="text-2xl select-none" role="img" aria-label="Parole et texte">
                      🗣️
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-app-text">
                      {t('dash.langToSignTitle', 'Language → Sign')}
                    </h3>
                    <p className="text-xs text-app-muted leading-relaxed">
                      {t(
                        'dash.langToSignDesc',
                        'Type or speak to translate spoken phrases into Algerian Sign Language clips.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-app-border flex items-center justify-between text-xs text-app-primary-strong font-semibold">
                  <span>Écrire ou dicter en LSA</span>
                  <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                </div>
              </Card>
            </section>

            {/* 3. Quick-Access Feature Cards (Pharmacy, Phrasebook, Real Stories) */}
            <section aria-labelledby="quick-features-heading" className="space-y-3">
              <h2 id="quick-features-heading" className="text-xs font-bold uppercase tracking-wider text-app-muted">
                Accès direct aux fonctionnalités
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Feature 1: Pharmacy & Healthcare */}
                <Card
                  interactive
                  p={20}
                  onClick={() => navigate('/app/phrasebook?context=healthcare')}
                  className="bg-app-surface border border-app-border hover:border-app-border-strong flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-control bg-teal-500/10 text-app-primary-strong flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-app-text">
                        {t('dash.featurePharmacyTitle', 'Pharmacy & Healthcare')}
                      </h3>
                      <p className="text-[11px] text-app-muted mt-1 leading-relaxed">
                        {t(
                          'dash.featurePharmacyDesc',
                          'Common clinical phrases and medical vocabulary for pharmacy interactions.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-app-primary-strong flex items-center gap-1">
                    <span>Ouvrir</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </div>
                </Card>

                {/* Feature 2: Phrasebook */}
                <Card
                  interactive
                  p={20}
                  onClick={() => navigate('/app/phrasebook')}
                  className="bg-app-surface border border-app-border hover:border-app-border-strong flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-control bg-teal-500/10 text-app-primary-strong flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-app-text">
                        {t('dash.featurePhrasebookTitle', 'Phrasebook')}
                      </h3>
                      <p className="text-[11px] text-app-muted mt-1 leading-relaxed">
                        {t(
                          'dash.featurePhrasebookDesc',
                          'Instant access to frequently used expressions and categorized signs.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-app-primary-strong flex items-center gap-1">
                    <span>Explorer</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </div>
                </Card>

                {/* Feature 3: Real Stories */}
                <Card
                  interactive
                  p={20}
                  onClick={() => navigate('/app/stories')}
                  className="bg-app-surface border border-app-border hover:border-app-border-strong flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-control bg-teal-500/10 text-app-primary-strong flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-app-text">
                        {t('dash.featureStoriesTitle', 'Real Stories')}
                      </h3>
                      <p className="text-[11px] text-app-muted mt-1 leading-relaxed">
                        {t(
                          'dash.featureStoriesDesc',
                          'Authentic experiences shared by our Deaf community and healthcare staff.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-app-primary-strong flex items-center gap-1">
                    <span>Lire les récits</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </div>
                </Card>
              </div>
            </section>

            {/* 4. Recent Conversations */}
            <section aria-labelledby="recent-heading" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-app-primary-strong" />
                  <h2 id="recent-heading" className="text-sm font-bold text-app-text">
                    {t('dash.recentConversations', 'Recent conversations')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/app/history')}
                  className="text-xs font-semibold text-app-primary-strong hover:underline"
                >
                  {t('dash.viewAll', 'View all')}
                </button>
              </div>

              {recentSessions.length === 0 ? (
                <div className="p-8 rounded-card bg-app-surface border border-app-border text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-app-surface-2 text-app-muted flex items-center justify-center mx-auto">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-app-muted">
                    {t('dash.noConversations', 'No conversations yet.')}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconStart={<MessageSquarePlus className="w-3.5 h-3.5" />}
                    onClick={() => navigate('/app/new?mode=two_way')}
                  >
                    {t('dash.startFirstConv', 'Start your first conversation')}
                  </Button>
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
                          <Pill className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-semibold text-app-text truncate">
                            {session.title}
                          </p>
                          <p className="text-[11px] text-app-muted">
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
            </section>
          </main>

          {/* Right Column (lg:col-span-4): Demo, Quick Phrases, Stories Carousel */}
          <aside aria-label="Panneau interactif d'accompagnement" className="lg:col-span-4 space-y-6">
            {/* A. Interactive Pharmacy Demo */}
            <div className="p-5 rounded-card bg-app-surface border border-app-primary-strong/30 shadow-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-app-primary-strong flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('dash.interactiveDemo', 'Interactive demonstration')}</span>
                </span>
                <Badge variant="demo" size="sm">
                  Démo
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-app-text">
                  {t('dash.tryDemo', 'Try the pharmacy demo')}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {t(
                    'dash.tryDemoDesc',
                    'Experience the complete two-way dialogue without needing camera or microphone access.'
                  )}
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                iconStart={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={handleStartDemo}
              >
                {t('dash.launchDemo', 'Launch demo')}
              </Button>
            </div>

            {/* B. Quick Phrases Card with Actionable Play */}
            <div className="p-5 rounded-card bg-app-surface border border-app-border space-y-3 shadow-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-app-text">
                  {t('dash.quickPhrases', 'Quick phrases')}
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/app/phrasebook')}
                  className="text-xs font-semibold text-app-primary-strong hover:underline"
                >
                  {t('dash.viewAll', 'View all')}
                </button>
              </div>

              <div className="space-y-2">
                {quickPhrases.map((phrase) => {
                  const text = phrase.text[currentLang] || phrase.text.fr;
                  return (
                    <div
                      key={phrase.id}
                      className="p-2.5 rounded-control bg-app-surface-2 border border-app-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-semibold text-app-text truncate">{text}</p>
                        <p className="text-[10px] text-app-muted font-mono">{phrase.gloss.join(' ')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickPhraseSend(phrase)}
                        className="p-1.5 rounded-control bg-app-surface hover:bg-app-primary-soft text-app-primary-strong transition-colors shrink-0"
                        title="Envoyer dans la conversation"
                        aria-label={`Envoyer phrase: ${text}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. Community Stories Card (Authentic Stories Carousel) */}
            <div className="p-5 rounded-card bg-app-surface border border-app-border space-y-3 shadow-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-app-text">
                  {t('dash.communityStories', 'Real voices, real experiences')}
                </h3>
                {STORIES.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStoryIndex((prev) =>
                          prev === 0 ? STORIES.length - 1 : prev - 1
                        )
                      }
                      className="p-1 rounded text-app-muted hover:text-app-text"
                      aria-label="Témoignage précédent"
                    >
                      <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStoryIndex((prev) =>
                          prev === STORIES.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-1 rounded text-app-muted hover:text-app-text"
                      aria-label="Témoignage suivant"
                    >
                      <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                  </div>
                )}
              </div>

              {currentStory ? (
                <div className="space-y-3 pt-1">
                  <div className="relative">
                    <Quote className="w-5 h-5 text-app-primary-strong/20 absolute -top-1 -start-1 rtl:-scale-x-100" />
                    <p className="text-xs text-app-text italic ps-3 leading-relaxed">
                      « {currentStory.quote[currentLang] || currentStory.quote.fr} »
                    </p>
                  </div>

                  <div className="pt-2 border-t border-app-border flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-app-text block">{currentStory.author}</span>
                      <span className="text-app-muted">{currentStory.role[currentLang] || currentStory.role.fr}</span>
                    </div>
                    <span className="text-[10px] text-app-muted font-mono">{currentStory.date}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-app-muted">
                  {t('dash.noStoriesYet', 'Be the first to share your experience with BridgeSign.')}
                </p>
              )}
            </div>

            {/* Illustration 2: "Every hand has a voice" wave banner */}
            <div className="rounded-card overflow-hidden border border-app-border-strong/40 bg-app-surface shadow-1">
              <img
                src="/illustrations/slogan-wave.png"
                alt="Every hand has a voice."
                className="w-full h-auto object-cover"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
