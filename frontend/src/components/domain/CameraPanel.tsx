import React from 'react';
import { Camera, FlipHorizontal, Eye, EyeOff } from 'lucide-react';
import { LandmarkOverlay } from './LandmarkOverlay';
import { LandmarkFrame } from '@/types/domain';
import { CameraStatus } from '@/hooks/useCamera';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { Toggle } from '@/components/ui/Toggle';

export interface CameraPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStatus: CameraStatus;
  errorCode: string | null;
  onStartCamera: () => void;
  mirror: boolean;
  onToggleMirror: () => void;
  showTracking: boolean;
  onToggleTracking: () => void;
  currentFrame?: LandmarkFrame;
  isRecognizing?: boolean;
  className?: string;
}

export const CameraPanel: React.FC<CameraPanelProps> = ({
  videoRef,
  cameraStatus,
  errorCode,
  onStartCamera,
  mirror,
  onToggleMirror,
  showTracking,
  onToggleTracking,
  currentFrame,
  isRecognizing = false,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Video Container Layer */}
      <div className="relative aspect-video sm:aspect-video w-full rounded-card bg-neutral-900 border border-app-border overflow-hidden shadow-1 flex items-center justify-center">
        {/* Layer 1: HTML5 Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transition-transform duration-200 ${
            mirror ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        />

        {/* Layer 2: Landmark Overlay Canvas */}
        <LandmarkOverlay
          hands={currentFrame?.hands}
          pose={currentFrame?.pose}
          showTracking={showTracking}
          mirror={mirror}
        />

        {/* Layer 3: Dashed Hands-Zone Guide Frame (hidden when recognizing) */}
        {!isRecognizing && cameraStatus === 'ready' && (
          <div
            aria-hidden="true"
            className="absolute inset-8 sm:inset-12 border-2 border-dashed border-app-primary-strong/40 rounded-xl pointer-events-none flex items-end justify-center pb-3"
          >
            <span className="bg-black/60 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-pill backdrop-blur-sm">
              Placez vos mains dans ce cadre
            </span>
          </div>
        )}

        {/* Camera Idle or Permission Needed State */}
        {cameraStatus === 'idle' && (
          <div className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
            <Camera className="w-10 h-10 text-app-primary-strong" />
            <p className="text-sm font-semibold">
              {t('rec.permissionSub', 'Autorisez la caméra pour commencer la reconnaissance LSA')}
            </p>
            <Button variant="primary" size="md" onClick={onStartCamera}>
              {t('rec.enableCam', 'Activer la caméra')}
            </Button>
          </div>
        )}

        {/* Camera Requesting State */}
        {cameraStatus === 'requesting' && (
          <div className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-app-primary-strong border-t-transparent animate-spin" />
            <p className="text-sm font-medium">Connexion à la caméra…</p>
          </div>
        )}

        {/* Camera Error State */}
        {cameraStatus === 'error' && (
          <div className="absolute inset-0 bg-neutral-900/95 flex items-center justify-center p-4">
            <ErrorState
              code={errorCode || 'CAM-001'}
              title={t('err.cam', 'Accès caméra impossible')}
              description={t('err.camDenied', 'Vérifiez les permissions de votre navigateur.')}
              onRetry={onStartCamera}
            />
          </div>
        )}
      </div>

      {/* Compact Toolbar Under Video */}
      <div className="flex items-center justify-between px-1 py-1 text-xs">
        {/* Mirror Toggle */}
        <button
          type="button"
          onClick={onToggleMirror}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control transition-colors ${
            mirror
              ? 'bg-app-primary-soft text-app-primary-strong font-semibold'
              : 'text-app-muted hover:text-app-text bg-app-surface-2'
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>{t('rec.mirrorPreview', 'Miroir')}</span>
        </button>

        {/* Show AI Tracking Toggle */}
        <div className="flex items-center gap-2">
          <Toggle
            checked={showTracking}
            onChange={onToggleTracking}
            label={
              <span className="text-xs font-medium text-app-muted flex items-center gap-1">
                {showTracking ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{t('rec.showTracking', 'Suivi IA')}</span>
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};
