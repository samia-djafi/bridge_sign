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
      subtitle={t('privacy.subtitle', 'Vos données restent strictement sous votre contrôle.')}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-sm text-app-text">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Privacy guarantees */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-2">
              <Lock className="w-4 h-4 text-app-primary-strong" />
              <span>{t('privacy.guaranteesTitle', 'Garanties de confidentialité')}</span>
            </h3>

            <div className="flex items-start gap-3 p-3.5 rounded-card bg-app-surface-2 border border-app-border">
              <Lock className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-app-text">{t('privacy.localVideoTitle', 'Traitement vidéo local')}</p>
                <p className="text-xs text-app-muted mt-1 leading-relaxed">
                  {t('privacy.localVideoDesc', "La vidéo et les flux de caméra sont traités en direct en mémoire sur cet appareil. Aucune image vidéo n'est stockée ni envoyée à des tiers.")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-card bg-app-surface-2 border border-app-border">
              <HardDrive className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-app-text">{t('privacy.localStorageTitle', 'Stockage local des messages')}</p>
                <p className="text-xs text-app-muted mt-1 leading-relaxed">
                  {t('privacy.localStorageDesc', "Les conversations sont enregistrées exclusivement dans la base de données IndexedDB locale de votre navigateur. Vous pouvez exporter ou effacer toutes vos données à tout moment dans les Paramètres.")}
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-app-muted">
              <KeyRound className="w-4 h-4 text-app-primary-strong" />
              <span>{t('privacy.shortcutsTitle', 'Raccourcis clavier (Espace de travail)')}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutCamera', 'Démarrer / Arrêter la caméra')}</span>
                <Kbd>{t('privacy.spaceKey', 'Espace')}</Kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutClose', 'Fermer la fenêtre / Annuler')}</span>
                <Kbd>{t('privacy.escKey', 'Échap')}</Kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutText', "Zone d'écriture")}</span>
                <div className="flex gap-1">
                  <Kbd>Alt</Kbd>
                  <Kbd>T</Kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutMic', 'Activer / Arrêter le micro')}</span>
                <div className="flex gap-1">
                  <Kbd>Alt</Kbd>
                  <Kbd>M</Kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutEmergency', "Phrases d'urgence")}</span>
                <div className="flex gap-1">
                  <Kbd>Alt</Kbd>
                  <Kbd>E</Kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutPrivacy', 'Confidentialité & Aide')}</span>
                <div className="flex gap-1">
                  <Kbd>Alt</Kbd>
                  <Kbd>P</Kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-control bg-app-surface-2 border border-app-border">
                <span className="font-medium text-app-text">{t('privacy.shortcutQuick', 'Phrases rapides')}</span>
                <div className="flex gap-1">
                  <Kbd>Alt</Kbd>
                  <Kbd>R</Kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="border-t border-app-border pt-3">
          <p className="text-xs text-app-muted leading-relaxed">
            {t(
              'disclaimer',
              "ConnectSign est un outil d'aide à la communication. Il ne remplace pas un interprète professionnel et ne fournit ni diagnostic ni conseil médical."
            )}
          </p>
        </div>
      </div>
    </Sheet>
  );
};
