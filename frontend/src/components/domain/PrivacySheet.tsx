import React from 'react';
import { useUiStore } from '@/stores/uiStore';
import { Sheet } from '@/components/ui/Sheet';
import { ShieldCheck, Lock, HardDrive, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Kbd } from '@/components/ui/Kbd';

export const PrivacySheet: React.FC = () => {
  const { t } = useTranslation();
  const { privacySheetOpen, setPrivacySheetOpen } = useUiStore();

  return (
    <Sheet
      isOpen={privacySheetOpen}
      onClose={() => setPrivacySheetOpen(false)}
      title={
        <div className="flex items-center gap-2 text-app-primary-strong">
          <ShieldCheck className="w-5 h-5" />
          <span>{t('privacy.helpTitle', 'Confidentialité & Aide')}</span>
        </div>
      }
      subtitle="Vos données restent strictement sous votre contrôle."
      maxWidth="md"
    >
      <div className="space-y-5 text-sm text-app-text">
        {/* Privacy guarantees */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-control bg-app-surface-2 border border-app-border">
            <Lock className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-app-text">Traitement vidéo local</p>
              <p className="text-xs text-app-muted mt-0.5">
                La vidéo et les flux de caméra sont traités en mémoire sur cet appareil. Aucune image
                vidéo n'est stockée ni envoyée à des tiers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-control bg-app-surface-2 border border-app-border">
            <HardDrive className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-app-text">Stockage local des messages</p>
              <p className="text-xs text-app-muted mt-0.5">
                Les conversations sont enregistrées exclusivement dans la base de données IndexedDB de votre
                navigateur. Vous pouvez tout exporter ou effacer à tout moment dans les Paramètres.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="border-t border-app-border pt-4">
          <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider text-app-muted">
            <KeyRound className="w-4 h-4" />
            <span>Raccourcis clavier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Démarrer / Arrêter la caméra</span>
              <Kbd>Espace</Kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Arrêter / Annuler</span>
              <Kbd>Échap</Kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Zone d'écriture</span>
              <div className="flex gap-1">
                <Kbd>Alt</Kbd>
                <Kbd>T</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Microphone</span>
              <div className="flex gap-1">
                <Kbd>Alt</Kbd>
                <Kbd>M</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Phrases d'urgence</span>
              <div className="flex gap-1">
                <Kbd>Alt</Kbd>
                <Kbd>E</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-control bg-app-surface-2">
              <span>Phrases rapides</span>
              <div className="flex gap-1">
                <Kbd>Alt</Kbd>
                <Kbd>P</Kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="border-t border-app-border pt-3">
          <p className="text-xs text-app-muted leading-relaxed">
            {t(
              'disclaimer',
              "LSA Bridge est un outil d'aide à la communication. Il ne remplace pas un interprète professionnel et ne fournit ni diagnostic ni conseil médical."
            )}
          </p>
        </div>
      </div>
    </Sheet>
  );
};
