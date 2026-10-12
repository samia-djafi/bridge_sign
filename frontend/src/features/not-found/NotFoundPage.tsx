import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Page introuvable (404) — BridgeSign`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-app-bg text-app-text select-none">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-card bg-app-surface border border-app-border-strong text-center space-y-6 shadow-3">
        {/* BridgeSign Official Logo Mark */}
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src="/icons/logo-mark.png"
            alt="BridgeSign Logo"
            className="w-14 h-14 rounded-control shadow-1 object-cover"
          />
          <div className="space-y-0.5">
            <h1 className="text-xl font-extrabold text-app-text tracking-tight">BridgeSign</h1>
            <p className="text-xs text-app-primary-strong font-medium italic">
              {t('app.tagline', 'Every Hand Has a Voice.')}
            </p>
          </div>
        </div>

        {/* 404 Heading & Explanatory Copy */}
        <div className="space-y-2 pt-2 border-t border-app-border">
          <span className="inline-block px-2.5 py-0.5 rounded-pill bg-app-surface-2 text-xs font-mono font-bold text-app-muted">
            404
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-app-text">
            {t('err.notFoundTitle', 'Nous n’avons pas pu trouver cette page.')}
          </h2>
          <p className="text-xs sm:text-sm text-app-muted leading-relaxed">
            {t('err.notFoundDesc', 'La page a peut-être été déplacée ou le lien est incorrect.')}
          </p>
        </div>

        {/* Actions: Back to Home & Go Back */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/app');
              }
            }}
            iconStart={<ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('err.goBack', 'Page précédente')}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate('/app')}
            iconStart={<Home className="w-4 h-4" />}
          >
            {t('err.backToHome', 'Retour à l’accueil')}
          </Button>
        </div>
      </div>
    </div>
  );
};
