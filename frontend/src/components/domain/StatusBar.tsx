import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/stores/uiStore';
import { registry } from '@/services/registry';
import { StatusType } from '@/components/ui/StatusIndicator';
import { Wifi, WifiOff, Camera, Mic, Cpu } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export interface StatusBarProps {
  title?: string;
  contextChip?: React.ReactNode;
  cameraStatus?: StatusType;
  micStatus?: StatusType;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  title,
  contextChip,
  cameraStatus = 'off',
  micStatus = 'off',
}) => {
  const { t } = useTranslation();
  const { isOnline } = useUiStore();
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const aiAdapter = registry.ai.adapter; // 'demo' | 'live'
  const isDemo = aiAdapter === 'demo';

  return (
    <header className="h-14 bg-app-surface border-b border-app-border px-4 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {contextChip}
        {title && <h1 className="text-base font-semibold text-app-text truncate">{title}</h1>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Camera Indicator */}
        <button
          type="button"
          onClick={() => setActivePopover('camera')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-app-surface-2 hover:bg-app-border text-xs font-medium text-app-text transition-colors"
          aria-label={t('dash.cameraStatus', 'Caméra')}
        >
          <Camera className="w-3.5 h-3.5 text-app-muted" />
          <span className="hidden sm:inline">{t('dash.cameraStatus', 'Caméra')}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              cameraStatus === 'active'
                ? 'bg-app-primary-strong animate-pulse'
                : cameraStatus === 'ready'
                ? 'bg-app-primary-strong'
                : 'bg-app-muted'
            }`}
          />
        </button>

        {/* Mic Indicator */}
        <button
          type="button"
          onClick={() => setActivePopover('mic')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-app-surface-2 hover:bg-app-border text-xs font-medium text-app-text transition-colors"
          aria-label={t('dash.micStatus', 'Microphone')}
        >
          <Mic className="w-3.5 h-3.5 text-app-muted" />
          <span className="hidden sm:inline">{t('dash.micStatus', 'Micro')}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              micStatus === 'active' ? 'bg-app-primary-strong animate-pulse' : 'bg-app-muted'
            }`}
          />
        </button>

        {/* AI Indicator */}
        <button
          type="button"
          onClick={() => setActivePopover('ai')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-app-surface-2 hover:bg-app-border text-xs font-medium text-app-text transition-colors"
          aria-label="Intelligence Artificielle"
        >
          <Cpu className="w-3.5 h-3.5 text-app-muted" />
          <span className="hidden sm:inline">IA:</span>
          <span className={`font-semibold ${isDemo ? 'text-app-warning' : 'text-emerald-600'}`}>
            {isDemo ? t('badge.demo', 'Démo') : t('badge.live', 'Direct')}
          </span>
        </button>

        {/* Network Indicator */}
        <button
          type="button"
          onClick={() => setActivePopover('network')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-app-surface-2 hover:bg-app-border text-xs font-medium text-app-text transition-colors"
          aria-label="Statut réseau"
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-app-success" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-app-warning" />
          )}
          <span className="hidden md:inline">
            {isOnline ? t('badge.online', 'En ligne') : t('badge.offline', 'Hors ligne')}
          </span>
        </button>
      </div>

      {/* Explanatory Popover Modal */}
      <Modal
        isOpen={activePopover !== null}
        onClose={() => setActivePopover(null)}
        title={
          activePopover === 'camera'
            ? t('dash.cameraStatus', 'Caméra')
            : activePopover === 'mic'
            ? t('dash.micStatus', 'Microphone')
            : activePopover === 'ai'
            ? 'Moteur IA LSA'
            : 'Statut du réseau'
        }
        maxWidth="sm"
      >
        <div className="space-y-3 text-sm text-app-text">
          {activePopover === 'camera' && (
            <p>
              La caméra capture vos mouvements de mains pour la reconnaissance des signes LSA.
              Les images restent entièrement sur votre appareil.
            </p>
          )}
          {activePopover === 'mic' && (
            <p>
              Le microphone permet à votre interlocuteur d'énoncer des phrases oralement via la
              reconnaissance vocale du navigateur.
            </p>
          )}
          {activePopover === 'ai' && (
            <p>
              {isDemo
                ? 'Mode démo actif : la reconnaissance simule des scénarios contrôlés. Connectez le backend HTTP dans les paramètres pour le mode direct.'
                : 'Mode direct actif : les points squelettiques normalisés sont traités pour reconnaître vos signes.'}
            </p>
          )}
          {activePopover === 'network' && (
            <p>
              {isOnline
                ? 'Vous êtes actuellement connecté à Internet.'
                : 'Mode hors ligne : la reconnaissance locale, le dictionnaire et les phrases enregistrées restent utilisables sans connexion.'}
            </p>
          )}
        </div>
      </Modal>
    </header>
  );
};
