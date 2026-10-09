import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { SessionMode } from '@/types/domain';
import { StatusBar } from '@/components/domain/StatusBar';
import { Loader } from 'lucide-react';

export const SingleModePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { startSession } = useSessionStore();
  const { settings } = useSettingsStore();

  const isSignToLang = location.pathname.includes('sign-to-language');
  const targetMode: SessionMode = isSignToLang ? 'sign_to_language' : 'language_to_sign';

  useEffect(() => {
    async function initSession() {
      // Create session in target mode and navigate into workspace
      const title = isSignToLang
        ? `LSA → ${settings.defaultSpokenLang.toUpperCase()}`
        : `${settings.defaultSpokenLang.toUpperCase()} → LSA`;

      const id = await startSession({
        title,
        context: settings.lastContext || 'healthcare',
        signLanguage: 'LSA',
        spokenLang: settings.defaultSpokenLang,
        mode: targetMode,
      });

      navigate(`/app/workspace/${id}`, { replace: true });
    }

    initSession();
  }, [isSignToLang, targetMode, settings, startSession, navigate]);

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={isSignToLang ? t('mode.signToLang') : t('mode.langToSign')} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3 text-app-muted">
        <Loader className="w-8 h-8 animate-spin text-app-primary-strong" />
        <p className="text-sm font-medium">Ouverture du mode ciblé…</p>
      </div>
    </div>
  );
};
