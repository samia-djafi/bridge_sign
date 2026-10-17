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

  const currentLang = (['en', 'fr', 'ar'].includes(i18n.language) ? i18n.language : 'en') as
    | 'en'
    | 'fr'
    | 'ar';

  useEffect(() => {
    document.title = `${t('nav.dashboard', 'Home')} | ${t('app.name', 'BridgeSign')}`;

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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">

        {/* Welcome Hero Section with Two-Hand Visual on the Left */}
        <section aria-labelledby="welcome-heading">
          <div className="relative overflow-hidden rounded-card bg-app-surface border border-app-border-strong/60 shadow-1 p-5 sm:p-6 lg:p-7 transition-all">
            <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8">
              {/* Left Side: Elegant Two-Hand Communication Motif */}
              <div className="shrink-0 flex items-center justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-teal-500/10 via-app-surface-2 to-teal-500/5 border border-teal-500/25 p-3 flex items-center justify-center shadow-1 group">
                  {/* Two Interlocking Hands Symbolic SVG (BridgeSign Palette: Teal #0D9488 & Deep Teal) */}
                  <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-[#0D9488] transition-transform duration-300 group-hover:scale-105"
                    role="img"
                    aria-label={t('dash.motifAria', 'Symbole de communication en langue des signes à deux mains')}
                  >
                    {/* Background Soft Glow Disc */}
                    <circle cx="60" cy="60" r="48" className="fill-teal-500/10" />

                    {/* Left Supporting Hand (Open receiving hand gesturing upwards) */}
                    <path
                      d="M26 74 C 26 58, 38 48, 52 48 C 55 48, 58 49, 61 51 C 61 44, 66 38, 73 38 C 76 38, 79 39, 81 41 C 82 35, 87 31, 93 31 C 98 31, 102 34, 104 38 C 105 44, 105 52, 101 64 C 95 82, 80 94, 60 94 C 41 94, 26 86, 26 74 Z"
                      fill="currentColor"
                      fillOpacity="0.88"
                    />

                    {/* Right Interlocking Inner Hand (Connecting palm silhouette) */}
                    <path
                      d="M50 78 C 45 74, 43 68, 45 61 C 47 54, 53 50, 58 53 C 62 55, 63 60, 61 66 C 65 60, 71 58, 75 62 C 78 65, 77 71, 73 76 C 77 72, 83 73, 84 78 C 85 83, 81 87, 75 88 C 67 89, 58 85, 50 78 Z"
                      className="fill-teal-950 dark:fill-white/90"
                      fillOpacity="0.9"
                    />

                    {/* Connection Bridge Arcs */}
                    <path
                      d="M36 44 C 48 32, 72 32, 84 44"
                      stroke="#2DD4BF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="2 3"
                    />
                    <circle cx="60" cy="34" r="2.5" fill="#2DD4BF" />
                  </svg>
                </div>
              </div>

              {/* Right Side: Welcome Content */}
              <div className="relative z-10 max-w-xl space-y-1.5 text-start">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-pill bg-teal-500/10 text-[#0D9488] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>{t('dash.bridgePill', 'Pont de communication')}</span>
                </div>
                <h2 id="welcome-heading" className="text-xl sm:text-2xl font-extrabold tracking-tight text-app-text">
                  {preferredName ? (
                    <>
                      {greetingText}, <span className="text-app-primary-strong">{preferredName}</span>
                    </>
                  ) : (
                    <span>{t('dash.welcomeGeneric', 'Welcome to BridgeSign.')}</span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-app-text">
                  {t('dash.welcomeQuote', 'Communication is a right, not a barrier.')}
                </p>
                <p className="text-xs text-app-muted leading-relaxed">
                  {t('app.tagline', 'Every Hand Has a Voice.')} — {t('dash.startTwoWaySub', 'Les deux personnes communiquent au même endroit.')}
                </p>
              </div>
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
                  {t('dash.conversationInProgress', 'Conversation en cours')}
                </span>
                <h2 className="font-bold text-sm sm:text-base text-app-text truncate">
                  {currentSession.title}
                </h2>
                <p className="text-xs text-app-muted">
                  {currentSession.messageCount || 0} {t('history.messages', 'messages')} · {status === 'paused' ? t('dash.paused', 'En pause') : t('dash.active', 'Active')}
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
                        {t('dash.recommended', 'Recommandé')}
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
                  <span>{t('dash.signToLangCta', 'Signer devant la caméra')}</span>
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
                  <span>{t('dash.langToSignCta', 'Écrire ou dicter en LSA')}</span>
                  <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                </div>
              </Card>
            </section>

            {/* 3. Quick-Access Feature Cards (Pharmacy, Phrasebook, Real Stories) */}
            <section aria-labelledby="quick-features-heading" className="space-y-3">
              <h2 id="quick-features-heading" className="text-xs font-bold uppercase tracking-wider text-app-muted">
                {t('dash.quickFeaturesTitle', 'Accès direct aux fonctionnalités')}
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
                    <span>{t('common.open', 'Ouvrir')}</span>
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
                    <span>{t('common.explore', 'Explorer')}</span>
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
                    <span>{t('common.readStories', 'Lire les récits')}</span>
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
                        title={t('dash.sendToConv', 'Envoyer dans la conversation')}
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
                      aria-label={t('dash.prevStory', 'Témoignage précédent')}
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
                      aria-label={t('dash.nextStory', 'Témoignage suivant')}
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

          </aside>
        </div>
      </div>
    </div>
  );
};
