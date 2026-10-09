import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/stores/uiStore';
import { Download, Sparkles, Smartphone, Share, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const InstallCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { canInstall, deferredInstallPrompt, setInstallPrompt } = useUiStore();
  const [showIosModal, setShowIosModal] = useState(false);

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
    } else if (isIos) {
      setShowIosModal(true);
    }
  };

  if (!canInstall && !isIos) return null;

  return (
    <>
      <div
        className={`p-5 rounded-card bg-app-surface border border-app-primary-strong/20 shadow-1 flex flex-col gap-3 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-control bg-app-primary-soft text-app-primary-strong flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-app-text">
              {t('app.installApp', "Installer l'application")}
            </h3>
            <p className="text-xs text-app-muted mt-0.5">
              Accès instantané depuis votre écran d’accueil · Fonctionne hors-ligne
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconStart={<Download className="w-4 h-4" />}
          onClick={handleInstallClick}
        >
          {t('app.installApp', "Installer l'application")}
        </Button>
      </div>

      {/* iOS Safari Instructions */}
      <Modal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
        title="Installer sur iPhone ou iPad"
        maxWidth="sm"
      >
        <div className="space-y-4 text-sm text-app-text">
          <p className="text-app-muted text-xs">
            Pour installer LSA Bridge sur Safari iOS, suivez ces 3 étapes simples :
          </p>

          <div className="flex items-center gap-3 p-3 rounded-control bg-app-surface-2 border border-app-border">
            <Share className="w-5 h-5 text-app-primary-strong shrink-0" />
            <div>
              <p className="font-semibold text-xs">1. Touchez le bouton Partager</p>
              <p className="text-[11px] text-app-muted">Dans la barre de navigation Safari</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-control bg-app-surface-2 border border-app-border">
            <PlusSquare className="w-5 h-5 text-app-primary-strong shrink-0" />
            <div>
              <p className="font-semibold text-xs">2. Sur l'écran d'accueil</p>
              <p className="text-[11px] text-app-muted">Faites défiler et sélectionnez cette option</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-control bg-app-surface-2 border border-app-border">
            <Sparkles className="w-5 h-5 text-app-primary-strong shrink-0" />
            <div>
              <p className="font-semibold text-xs">3. Touchez 'Ajouter'</p>
              <p className="text-[11px] text-app-muted">En haut à droite de l'écran</p>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={() => setShowIosModal(false)}>
            J'ai compris
          </Button>
        </div>
      </Modal>
    </>
  );
};
