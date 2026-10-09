import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUiStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/domain/LanguageSelector';
import { Download, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicEntryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings, setUiLanguage } = useSettingsStore();
  const { canInstall, deferredInstallPrompt, setInstallPrompt, setPrivacySheetOpen } = useUiStore();

  useEffect(() => {
    document.title = `${t('app.name')} — ${t('app.tagline')}`;
  }, [t]);

  const isIos =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const handleInstallClick = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between p-6">
      {/* Top Header: Language Switcher */}
      <header className="flex justify-end w-full max-w-lg mx-auto">
        <div className="w-40">
          <LanguageSelector
            value={settings.uiLang}
            onChange={(lang) => setUiLanguage(lang)}
          />
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Logo mark 56px */}
        <div className="w-14 h-14 rounded-2xl bg-app-primary-strong flex items-center justify-center shadow-2">
          <img src="/icons/logo-mark.svg" alt="" className="w-9 h-9 invert" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-app-text">
            {t('app.name', 'LSA Bridge')}
          </h1>
          <p className="text-base font-semibold text-app-primary-strong">
            {t('app.tagline', 'Deux modalités. Une seule conversation.')}
          </p>
        </div>

        {/* 2-sentence description */}
        <p className="text-sm text-app-muted leading-relaxed max-w-sm">
          {t(
            'app.description',
            "Outil de communication bidirectionnel entre la Langue des Signes Algérienne (LSA) et le français, l'arabe et l'anglais parlés ou écrits."
          )}
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            iconEnd={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/app')}
          >
            {t('app.openApp', "Ouvrir l'application")}
          </Button>

          {(canInstall || isIos) && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              iconStart={<Download className="w-4 h-4" />}
              onClick={handleInstallClick}
            >
              {t('app.installApp', "Installer l'application")}
            </Button>
          )}
        </div>

        {/* Medical / Legal Disclaimer */}
        <div className="pt-4 border-t border-app-border">
          <p className="text-xs text-app-muted leading-relaxed">
            {t(
              'disclaimer',
              "LSA Bridge est un outil d'aide à la communication. Il ne remplace pas un interprète professionnel et ne fournit ni diagnostic ni conseil médical."
            )}
          </p>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-md mx-auto flex items-center justify-between text-xs text-app-muted pt-6">
        <span>v{import.meta.env.VITE_APP_VERSION || '0.1.0'}</span>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPrivacySheetOpen(true)}
            className="hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('nav.privacyHelp', 'Confidentialité')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/about')}
            className="hover:underline"
          >
            {t('nav.about', 'À propos')}
          </button>
        </div>
      </footer>
    </div>
  );
};
