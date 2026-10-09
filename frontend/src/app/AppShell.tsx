import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useUiStore } from '@/stores/uiStore';
import {
  MessageSquarePlus,
  ArrowLeftRight,
  BookOpen,
  History,
  Activity,
  Settings,
  ShieldCheck,
  Home,
  MoreHorizontal,
  Siren,
  Info,
} from 'lucide-react';
import { OfflineBanner } from '@/components/domain/OfflineBanner';
import { ToastContainer } from '@/components/ui/Toast';
import { EmergencySheet } from '@/components/domain/EmergencySheet';
import { PrivacySheet } from '@/components/domain/PrivacySheet';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';

export const AppShell: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentSession, status } = useSessionStore();
  const { setPrivacySheetOpen, setEmergencySheetOpen } = useUiStore();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const hasActiveSession = currentSession && status === 'active';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-control text-sm font-medium transition-colors select-none ${
      isActive
        ? 'bg-app-primary-soft text-app-primary-strong border-s-4 border-app-primary-strong font-semibold shadow-1'
        : 'text-app-text hover:bg-app-surface-2 hover:text-app-primary-strong'
    }`;

  const mobileTabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
      isActive ? 'text-app-primary-strong font-bold' : 'text-app-muted hover:text-app-text'
    }`;

  return (
    <div className="flex h-screen w-full bg-app-bg text-app-text overflow-hidden">
      {/* Skip to Main Content Link for Keyboard A11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-app-primary-strong focus:text-white focus:rounded-control focus:shadow-3 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('app.skipLink', 'Aller au contenu principal')}
      </a>

      {/* Desktop / Tablet Sidebar (hidden on mobile < 768) */}
      <aside
        aria-label="Navigation principale"
        className="hidden md:flex flex-col justify-between w-18 lg:w-64 bg-app-surface border-e border-app-border shrink-0 select-none z-20"
      >
        {/* Top: Logo & Nav sections */}
        <div className="flex flex-col p-4 overflow-y-auto">
          {/* Logo & Brand */}
          <NavLink
            to="/app"
            className="flex items-center gap-3 py-2 px-1 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong mb-6"
          >
            <div className="w-10 h-10 rounded-control bg-app-primary-strong flex items-center justify-center shrink-0 shadow-1">
              <img src="/icons/logo-mark.svg" alt="" className="w-6 h-6 invert" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-bold text-base tracking-tight text-app-text">LSA Bridge</span>
              <span className="text-[10px] text-app-muted leading-tight truncate">
                {t('app.tagline', 'Deux modalités. Une seule conversation.')}
              </span>
            </div>
          </NavLink>

          {/* Section: WORKSPACE */}
          <div className="space-y-1 mb-6">
            <span className="hidden lg:block text-[11px] font-bold text-app-muted uppercase tracking-wider px-3 mb-2">
              {t('nav.workspace', 'ESPACE DE TRAVAIL')}
            </span>

            <NavLink to="/app/new" className={navLinkClass}>
              <MessageSquarePlus className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{t('nav.newConversation', 'Nouvelle conversation')}</span>
            </NavLink>

            <NavLink
              to={hasActiveSession ? `/app/workspace/${currentSession.id}` : '/app/new?mode=two_way'}
              className={navLinkClass}
            >
              <div className="relative shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
                {hasActiveSession && (
                  <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white" />
                )}
              </div>
              <span className="hidden lg:inline">{t('nav.twoWay', 'Conversation à double sens')}</span>
            </NavLink>
          </div>

          {/* Section: RESOURCES */}
          <div className="space-y-1 mb-6">
            <span className="hidden lg:block text-[11px] font-bold text-app-muted uppercase tracking-wider px-3 mb-2">
              {t('nav.resources', 'RESSOURCES')}
            </span>

            <NavLink to="/app/phrasebook" className={navLinkClass}>
              <BookOpen className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{t('nav.phrasebook', 'Phrases rapides')}</span>
            </NavLink>

            <NavLink to="/app/history" className={navLinkClass}>
              <History className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{t('nav.history', 'Historique')}</span>
            </NavLink>
          </div>

          {/* Section: SYSTEM */}
          <div className="space-y-1">
            <span className="hidden lg:block text-[11px] font-bold text-app-muted uppercase tracking-wider px-3 mb-2">
              {t('nav.system', 'SYSTÈME')}
            </span>

            <NavLink to="/app/diagnostics" className={navLinkClass}>
              <Activity className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{t('nav.diagnostics', 'Diagnostic IA')}</span>
            </NavLink>

            <NavLink to="/app/settings" className={navLinkClass}>
              <Settings className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{t('nav.settings', 'Paramètres')}</span>
            </NavLink>
          </div>
        </div>

        {/* Footer: Privacy, Emergency & Profile */}
        <div className="p-3 border-t border-app-border space-y-2">
          {/* Emergency Trigger Button */}
          <button
            type="button"
            onClick={() => setEmergencySheetOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-control bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors"
          >
            <Siren className="w-4 h-4 text-app-warning shrink-0" />
            <span className="hidden lg:inline">{t('emergency.button', 'Phrases d’urgence')}</span>
          </button>

          {/* Privacy & Help */}
          <button
            type="button"
            onClick={() => setPrivacySheetOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-control text-xs text-app-muted hover:text-app-text hover:bg-app-surface-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-app-primary-strong" />
            <span className="hidden lg:inline">{t('nav.privacyHelp', 'Confidentialité & Aide')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Offline notification banner if network dropped */}
        <OfflineBanner />

        {/* Route views rendered inside scrollable main container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto outline-none pb-20 md:pb-0"
        >
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar (fixed on screen bottom for mobile < 768) */}
        <nav
          aria-label="Navigation mobile"
          className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-app-surface border-t border-app-border flex items-center justify-around z-30 px-2 select-none"
        >
          {/* Home */}
          <NavLink to="/app" end className={mobileTabClass}>
            <Home className="w-5 h-5" />
            <span>{t('nav.dashboard', 'Accueil')}</span>
          </NavLink>

          {/* Phrases */}
          <NavLink to="/app/phrasebook" className={mobileTabClass}>
            <BookOpen className="w-5 h-5" />
            <span>{t('nav.phrasebook', 'Phrases')}</span>
          </NavLink>

          {/* Talk (Emphasized Center Action) */}
          <button
            type="button"
            onClick={() => {
              if (hasActiveSession) {
                navigate(`/app/workspace/${currentSession.id}`);
              } else {
                navigate('/app/new');
              }
            }}
            className="flex flex-col items-center justify-center -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-app-primary-strong text-white shadow-2 flex items-center justify-center hover:bg-app-primary-hover active:scale-95 transition-all">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-app-primary-strong mt-0.5">
              {hasActiveSession ? t('dash.resume', 'Reprendre') : t('dash.start', 'Parler')}
            </span>
          </button>

          {/* History */}
          <NavLink to="/app/history" className={mobileTabClass}>
            <History className="w-5 h-5" />
            <span>{t('nav.history', 'Historique')}</span>
          </NavLink>

          {/* More Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-app-muted hover:text-app-text"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {/* Mobile More Sheet */}
      <Sheet
        isOpen={mobileMoreOpen}
        onClose={() => setMobileMoreOpen(false)}
        title="Menu & Outils"
        maxWidth="sm"
      >
        <div className="space-y-2 text-sm">
          <Button
            variant="ghost"
            fullWidth
            iconStart={<Siren className="w-5 h-5 text-app-warning" />}
            onClick={() => {
              setMobileMoreOpen(false);
              setEmergencySheetOpen(true);
            }}
          >
            {t('emergency.title', 'Phrases d’urgence')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconStart={<Activity className="w-5 h-5 text-app-primary-strong" />}
            onClick={() => {
              setMobileMoreOpen(false);
              navigate('/app/diagnostics');
            }}
          >
            {t('nav.diagnostics', 'Diagnostic IA')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconStart={<Settings className="w-5 h-5" />}
            onClick={() => {
              setMobileMoreOpen(false);
              navigate('/app/settings');
            }}
          >
            {t('nav.settings', 'Paramètres')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconStart={<Info className="w-5 h-5" />}
            onClick={() => {
              setMobileMoreOpen(false);
              navigate('/app/about');
            }}
          >
            {t('nav.about', 'À propos de LSA Bridge')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconStart={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            onClick={() => {
              setMobileMoreOpen(false);
              setPrivacySheetOpen(true);
            }}
          >
            {t('nav.privacyHelp', 'Confidentialité & Aide')}
          </Button>
        </div>
      </Sheet>

      {/* Global Modals & Sheets */}
      <ToastContainer />
      <EmergencySheet />
      <PrivacySheet />
    </div>
  );
};
