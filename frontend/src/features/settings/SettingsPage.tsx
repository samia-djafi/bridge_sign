import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUiStore } from '@/stores/uiStore';
import { registry } from '@/services/registry';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Modal } from '@/components/ui/Modal';
import { downloadFile } from '@/lib/download';
import {
  Globe,
  Palette,
  Eye,
  Camera,
  Volume2,
  Cpu,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  User,
  RefreshCw,
  Mic,
  CheckCircle2,
  Play,
  Square,
  Activity,
} from 'lucide-react';
import { useProfileStore } from '@/stores/profileStore';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, setUiLanguage, resetSettings } = useSettingsStore();
  const { addToast } = useUiStore();
  const { preferredName, setPreferredName } = useProfileStore();

  const [nameInput, setNameInput] = useState(preferredName || '');

  const [activeTab, setActiveTab] = useState<
    'profile' | 'language' | 'appearance' | 'a11y' | 'camera' | 'audio' | 'ai' | 'privacy'
  >('profile');

  // Interactive Camera Test State
  const [isTestingCamera, setIsTestingCamera] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraResolution, setCameraResolution] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Interactive Mic Test State
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stopCameraTest = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setIsTestingCamera(false);
    setCameraResolution(null);
  };

  const startCameraTest = async (facing: 'user' | 'environment' = cameraFacingMode) => {
    stopCameraTest();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(t('err.camNotFound', 'No camera found on this device.'));
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      cameraStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play().catch(() => {});
      }
      const track = stream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings();
        setCameraResolution(
          `${settings.width || 1280} × ${settings.height || 720}${
            settings.frameRate ? ` @ ${Math.round(settings.frameRate)}fps` : ''
          }`
        );
      }
      setIsTestingCamera(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(t('err.camDenied', 'Camera access was denied.'));
      } else {
        setCameraError(err.message || t('err.cam', 'Camera could not be accessed.'));
      }
      setIsTestingCamera(false);
    }
  };

  const toggleTestFacingMode = () => {
    const next = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(next);
    if (isTestingCamera) {
      startCameraTest(next);
    }
  };

  const stopMicTest = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setIsTestingMic(false);
    setMicVolume(0);
  };

  const startMicTest = async () => {
    stopMicTest();
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError(t('err.micUnsupported', 'Voice input is not supported in this browser.'));
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] ?? 0;
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 64) * 100));
        setMicVolume(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
      setIsTestingMic(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError(t('err.micDenied', 'Microphone access was denied.'));
      } else {
        setMicError(err.message || t('err.mic', 'Microphone could not be accessed.'));
      }
      setIsTestingMic(false);
    }
  };

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCameraTest();
      stopMicTest();
    };
  }, [activeTab]);

  useEffect(() => {
    document.title = `${t('nav.settings', 'Settings')} | ${t('app.name', 'BridgeSign')}`;
  }, [t]);

  const [savedIndicator, setSavedIndicator] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [testApiLoading, setTestApiLoading] = useState(false);
  const [testApiResult, setTestApiResult] = useState<string | null>(null);

  const triggerSaved = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1500);
  };

  const handleTestApi = async () => {
    setTestApiLoading(true);
    setTestApiResult(null);
    try {
      const res = await fetch(`${settings.ai.apiBaseUrl}/health`, { method: 'GET' });
      if (res.ok) {
        setTestApiResult('Connexion réussie ✓ (API LSA active)');
      } else {
        setTestApiResult(`Erreur HTTP: ${res.status}`);
      }
    } catch {
      setTestApiResult('Serveur injoignable (Erreur AI-004)');
    } finally {
      setTestApiLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteInputText !== 'DELETE') return;
    await registry.sessions.clearAll();
    resetSettings();
    setDeleteConfirmOpen(false);
    addToast({ message: 'Toutes les données locales ont été effacées', type: 'status' });
  };

  const handleExportAll = async () => {
    const list = await registry.sessions.list();
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      sessions: list,
    };
    downloadFile('bridgesign_full_backup.json', JSON.stringify(payload, null, 2), 'application/json');
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-app-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-app-text">{t('nav.settings', 'Paramètres')}</h2>
            <p className="text-xs text-app-muted mt-0.5">
              {t('settings.subtitle', 'Accessibility, sensor, and artificial intelligence preferences.')}
            </p>
          </div>

          <div
            aria-live="polite"
            className={`text-xs font-semibold text-emerald-600 transition-opacity ${
              savedIndicator ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {t('settings.saved', 'Paramètres enregistrés ✓')}
          </div>
        </div>

        {/* Two-column layout on desktop: Tab nav on left, settings content on right */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tab Navigation */}
          <nav aria-label={t('settings.navAria', 'Settings categories')} className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'profile', label: t('settings.tabs.profile', 'Profil'), icon: <User className="w-4 h-4" /> },
              { id: 'language', label: t('settings.tabs.language', 'Langue'), icon: <Globe className="w-4 h-4" /> },
              { id: 'appearance', label: t('settings.tabs.appearance', 'Apparence'), icon: <Palette className="w-4 h-4" /> },
              { id: 'a11y', label: t('settings.tabs.a11y', 'Accessibilité'), icon: <Eye className="w-4 h-4" /> },
              { id: 'camera', label: t('settings.tabs.camera', 'Caméra'), icon: <Camera className="w-4 h-4" /> },
              { id: 'audio', label: t('settings.tabs.audio', 'Audio & Voix'), icon: <Volume2 className="w-4 h-4" /> },
              { id: 'ai', label: t('settings.tabs.ai', 'Intelligence Artificielle'), icon: <Cpu className="w-4 h-4" /> },
              { id: 'privacy', label: t('settings.tabs.privacy', 'Confidentialité'), icon: <Shield className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-control text-xs font-semibold whitespace-nowrap transition-colors text-start ${
                  activeTab === tab.id
                    ? 'bg-app-primary-soft text-app-primary-strong shadow-sm'
                    : 'text-app-muted hover:text-app-text hover:bg-app-surface-2'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings Content Area */}
          <div className="md:col-span-3 space-y-6">
            {/* TAB: Profile */}
            {activeTab === 'profile' && (
              <Card p={24} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-app-text">{t('settings.preferredNameLabel', 'Nom préféré')}</h3>
                  <p className="text-xs text-app-muted mt-1">
                    {t('settings.preferredNameHelp', 'Ce nom est enregistré uniquement sur cet appareil et utilisé pour votre message d\'accueil.')}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={t('onboarding.namePlaceholder', 'Enter your preferred name')}
                      maxLength={40}
                      className="flex-1 h-10 px-3.5 rounded-control bg-app-surface-2 border border-app-border text-sm text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong transition-all"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        const trimmed = nameInput.trim();
                        await setPreferredName(trimmed ? trimmed : null);
                        triggerSaved();
                        addToast({ message: t('settings.saved', 'Paramètres enregistrés ✓'), type: 'status' });
                      }}
                    >
                      {t('settings.saveName', 'Enregistrer le nom')}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* TAB: Language */}
            {activeTab === 'language' && (
              <Card p={24} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-app-text">{t('settings.uiLangLabel', 'Langue de l’interface')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {(['fr', 'ar', 'en'] as const).map((l) => (
                      <Card
                        key={l}
                        asButton
                        interactive
                        selected={settings.uiLang === l}
                        onClick={() => {
                          setUiLanguage(l);
                          triggerSaved();
                        }}
                        className="p-3 text-center"
                      >
                        <p className="font-bold text-sm">{l === 'fr' ? 'Français' : l === 'ar' ? 'العربية' : 'English'}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border">
                  <h3 className="text-base font-bold text-app-text">{t('settings.spokenLangLabel', 'Langue parlée par défaut')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {(['fr', 'ar', 'en'] as const).map((l) => (
                      <Card
                        key={l}
                        asButton
                        interactive
                        selected={settings.defaultSpokenLang === l}
                        onClick={() => {
                          updateSettings({ defaultSpokenLang: l });
                          triggerSaved();
                        }}
                        className="p-3 text-center"
                      >
                        <p className="font-bold text-sm">{l === 'fr' ? 'Français' : l === 'ar' ? 'العربية' : 'English'}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* TAB: Appearance */}
            {activeTab === 'appearance' && (
              <Card p={24} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-app-text">{t('settings.themeLabel', 'Thème d’affichage')}</h3>
                  <div className="mt-3">
                    <SegmentedControl
                      value={settings.theme}
                      onChange={(theme) => {
                        updateSettings({ theme });
                        triggerSaved();
                      }}
                      options={[
                        { value: 'system', label: t('settings.themeSystem', 'Système') },
                        { value: 'light', label: t('settings.themeLight', 'Clair') },
                        { value: 'dark', label: t('settings.themeDark', 'Sombre') },
                        { value: 'hc', label: t('settings.themeHc', 'Contraste Élevé') },
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border">
                  <h3 className="text-base font-bold text-app-text">{t('settings.textSizeLabel', 'Taille du texte')}</h3>
                  <div className="mt-3">
                    <SegmentedControl
                      value={settings.textScale.toString() as any}
                      onChange={(scale) => {
                        updateSettings({ textScale: Number(scale) as any });
                        triggerSaved();
                      }}
                      options={[
                        { value: '100', label: t('settings.scale100', '100% (Standard)') },
                        { value: '125', label: t('settings.scale125', '125% (Large)') },
                        { value: '150', label: t('settings.scale150', '150% (Extra Large)') },
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border">
                  <h3 className="text-base font-bold text-app-text">{t('settings.reducedMotionLabel', 'Réduction des animations')}</h3>
                  <div className="mt-3">
                    <SegmentedControl
                      value={settings.reducedMotion}
                      onChange={(reducedMotion) => {
                        updateSettings({ reducedMotion });
                        triggerSaved();
                      }}
                      options={[
                        { value: 'system', label: t('settings.motionSystem', 'System') },
                        { value: 'off', label: t('settings.motionOff', 'Animations enabled') },
                        { value: 'on', label: t('settings.motionOn', 'Animations reduced') },
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* TAB: Accessibility */}
            {activeTab === 'a11y' && (
              <Card p={24} className="space-y-5">
                <Toggle
                  checked={settings.captions}
                  onChange={(captions) => {
                    updateSettings({ captions });
                    triggerSaved();
                  }}
                  label={t('settings.captionsLabel', 'Sous-titres sur les vidéos de signes')}
                  description={t('settings.captionsDesc', 'Affiche la glose et la traduction sous chaque clip')}
                />

                <Toggle
                  checked={settings.showGloss}
                  onChange={(showGloss) => {
                    updateSettings({ showGloss });
                    triggerSaved();
                  }}
                  label={t('settings.showGlossLabel', 'Afficher les étiquettes de gloses')}
                  description={t('settings.showGlossDesc', 'Montre les identifiants de signes LSA (ex: MAL-DE-TÊTE)')}
                />

                <Toggle
                  checked={settings.largeTargets}
                  onChange={(largeTargets) => {
                    updateSettings({ largeTargets });
                    triggerSaved();
                  }}
                  label={t('settings.largeTargetsLabel', 'Grandes cibles tactiles (56px)')}
                  description={t('settings.largeTargetsDesc', 'Facilite la manipulation sur écran tactile')}
                />

                <Toggle
                  checked={settings.haptics}
                  onChange={(haptics) => {
                    updateSettings({ haptics });
                    triggerSaved();
                  }}
                  label={t('settings.hapticsLabel', 'Retour haptique (vibrations)')}
                  description={t('settings.hapticsDesc', 'Vibre lors de la confirmation d’un signe ou d’une alerte')}
                />
              </Card>
            )}

            {/* TAB: Camera with Live Camera Test & Facing Mode Switching */}
            {activeTab === 'camera' && (
              <div className="space-y-6">
                <Card p={24} className="space-y-5">
                  <Toggle
                    checked={settings.camera.mirror}
                    onChange={(mirror) => {
                      updateSettings({ camera: { ...settings.camera, mirror } });
                      triggerSaved();
                    }}
                    label={t('settings.cameraMirror', 'Effet miroir sur la prévisualisation')}
                    description={t('settings.cameraMirrorDesc', 'Permet de voir ses gestes comme dans un miroir naturel')}
                  />

                  <Toggle
                    checked={settings.camera.showTrackingByDefault}
                    onChange={(showTrackingByDefault) => {
                      updateSettings({
                        camera: { ...settings.camera, showTrackingByDefault },
                      });
                      triggerSaved();
                    }}
                    label={t('settings.cameraTrackingLabel', 'Afficher le suivi IA par défaut')}
                    description={t('settings.cameraTrackingDesc', 'Dessine en direct les 21 points squelettiques des mains')}
                  />
                </Card>

                {/* Interactive Camera Device Test Panel */}
                <Card p={24} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-app-text">{t('settings.cameraTest', 'Test camera')}</h4>
                      <p className="text-xs text-app-muted mt-0.5">
                        Vérifiez l'accès à la caméra et basculez entre capteur avant et arrière.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTestingCamera && (
                        <Button
                          variant="secondary"
                          size="sm"
                          iconStart={<RefreshCw className="w-3.5 h-3.5" />}
                          onClick={toggleTestFacingMode}
                        >
                          {cameraFacingMode === 'user'
                            ? t('rec.rearCamera', 'Caméra arrière')
                            : t('rec.frontCamera', 'Caméra avant')}
                        </Button>
                      )}

                      <Button
                        variant={isTestingCamera ? 'destructive' : 'primary'}
                        size="sm"
                        iconStart={isTestingCamera ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        onClick={isTestingCamera ? stopCameraTest : () => startCameraTest()}
                      >
                        {isTestingCamera
                          ? t('settings.stopCameraTestBtn', 'Arrêter le test caméra')
                          : t('settings.testCameraBtn', 'Tester la caméra')}
                      </Button>
                    </div>
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-control bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-app-error flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  {isTestingCamera ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-card overflow-hidden bg-black border border-app-border flex items-center justify-center">
                        <video
                          ref={cameraVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${
                            settings.camera.mirror && cameraFacingMode === 'user' ? '-scale-x-100' : ''
                          }`}
                        />
                        {cameraResolution && (
                          <div className="absolute top-2 start-2 px-2 py-0.5 rounded-pill bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                            {t('settings.cameraResolution', 'Résolution')} : {cameraResolution}
                          </div>
                        )}
                        <div className="absolute bottom-2 end-2 px-2.5 py-1 rounded-pill bg-emerald-500/80 backdrop-blur-sm text-[11px] font-bold text-white flex items-center gap-1.5 shadow-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('settings.cameraActive', 'Caméra active')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-card bg-app-surface-2 border border-dashed border-app-border text-center space-y-1">
                      <Camera className="w-6 h-6 text-app-muted mx-auto" />
                      <p className="text-xs text-app-muted">
                        {t('settings.cameraNotActive', 'La prévisualisation de la caméra est inactive.')}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* TAB: Audio & Speech with Live Microphone Meter & Speech API Check */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <Card p={24} className="space-y-5">
                  <Toggle
                    checked={settings.audio.voiceOutput}
                    onChange={(voiceOutput) => {
                      updateSettings({ audio: { ...settings.audio, voiceOutput } });
                      triggerSaved();
                    }}
                    label={t('settings.voiceOutputLabel', 'Sortie vocale automatique')}
                    description={t('settings.voiceOutputDesc', 'Énonce vocalement les phrases traduites dès leur envoi')}
                  />

                  <div className="pt-3 border-t border-app-border space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-app-muted">
                      {t('settings.speechRateLabel', 'Vitesse d’élocution')} : {settings.audio.rate}×
                    </label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.1"
                      value={settings.audio.rate}
                      onChange={(e) => {
                        updateSettings({
                          audio: { ...settings.audio, rate: parseFloat(e.target.value) },
                        });
                        triggerSaved();
                      }}
                      className="w-full accent-app-primary-strong"
                    />
                  </div>
                </Card>

                {/* Interactive Microphone Test Panel */}
                <Card p={24} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-app-text">{t('settings.micTest', 'Test microphone')}</h4>
                      <p className="text-xs text-app-muted mt-0.5">
                        {t('settings.micTestDesc', 'Test the microphone and monitor captured input volume in real time.')}
                      </p>
                    </div>

                    <Button
                      variant={isTestingMic ? 'destructive' : 'primary'}
                      size="sm"
                      iconStart={isTestingMic ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      onClick={isTestingMic ? stopMicTest : startMicTest}
                    >
                      {isTestingMic
                        ? t('settings.stopMicTestBtn', 'Arrêter le test micro')
                        : t('settings.testMicBtn', 'Tester le micro')}
                    </Button>
                  </div>

                  {micError && (
                    <div className="p-3 rounded-control bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-app-error flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{micError}</span>
                    </div>
                  )}

                  {/* Audio Visualizer Level Bar */}
                  <div className="space-y-2 p-3.5 rounded-card bg-app-surface-2 border border-app-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-app-text flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-app-primary-strong" />
                        <span>{t('settings.micVolumeLevel', "Niveau d'entrée audio")}</span>
                      </span>
                      <span className="font-mono text-app-muted">{micVolume}%</span>
                    </div>

                    <div className="w-full h-3 rounded-pill bg-app-surface border border-app-border overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-app-primary-strong transition-all duration-75"
                        style={{ width: `${micVolume}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-app-muted pt-1 border-t border-app-border">
                      <span>
                        {t('settings.micSpeechApiStatus', {
                          status: isSpeechSupported
                            ? t('settings.speechApiSupported', 'Supporté')
                            : t('settings.speechApiUnsupported', 'Non supporté sur ce navigateur'),
                        })}
                      </span>
                      {isTestingMic && (
                        <span className="font-semibold text-emerald-600 animate-pulse">
                          {t('settings.micActive', 'Microphone en écoute...')}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* TAB: AI Adapter */}
            {activeTab === 'ai' && (
              <Card p={24} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-app-text">{t('settings.aiAdapterLabel', 'Adaptateur IA')}</h3>
                  <div className="mt-3">
                    <SegmentedControl
                      value={settings.ai.adapter}
                      onChange={(adapter) => {
                        updateSettings({ ai: { ...settings.ai, adapter } });
                        triggerSaved();
                      }}
                      options={[
                        { value: 'mock', label: t('settings.adapterDemo', 'Demo Mode (Local simulation)') },
                        { value: 'http', label: t('settings.adapterHttp', 'Direct HTTP Server (Live backend)') },
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                {settings.ai.adapter === 'http' && (
                  <div className="space-y-3 pt-3 border-t border-app-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-app-muted">
                      {t('settings.apiBaseUrl', 'URL de base de l’API')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={settings.ai.apiBaseUrl}
                        onChange={(e) =>
                          updateSettings({
                            ai: { ...settings.ai, apiBaseUrl: e.target.value },
                          })
                        }
                        className="flex-1 h-11 px-3.5 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm"
                      />
                      <Button
                        variant="secondary"
                        size="md"
                        loading={testApiLoading}
                        onClick={handleTestApi}
                      >
                        {t('settings.testConnection', 'Tester')}
                      </Button>
                    </div>

                    {testApiResult && (
                      <p className="text-xs font-medium text-app-muted">{testApiResult}</p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* TAB: Privacy & Local Data */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card p={24} className="space-y-4">
                  <h3 className="text-base font-bold text-app-text">{t('settings.storageTitle', 'Stockage des données')}</h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    {t('settings.storageDesc', 'Toutes vos conversations et vos paramètres sont stockés localement sur cet appareil via IndexedDB et localStorage.')}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleExportAll}
                      iconStart={<Download className="w-4 h-4" />}
                    >
                      {t('settings.exportAll', 'Exporter toutes les données')}
                    </Button>
                  </div>
                </Card>

                {/* Danger Zone */}
                <div className="p-6 rounded-card border-2 border-app-error/40 bg-app-surface space-y-4">
                  <div className="flex items-center gap-2 text-app-error">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-base font-bold">{t('settings.dangerZoneTitle', 'Zone de danger')}</h3>
                  </div>
                  <p className="text-xs text-app-muted">
                    {t('settings.dangerZoneDesc', 'La suppression des données locales efface définitivement toutes vos conversations et réinitialise vos préférences.')}
                  </p>

                  <Button
                    variant="destructive"
                    size="md"
                    onClick={() => setDeleteConfirmOpen(true)}
                    iconStart={<Trash2 className="w-4 h-4" />}
                  >
                    {t('settings.deleteAll', 'Supprimer toutes les données locales')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete All Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteInputText('');
        }}
        title={t('settings.deleteConfirmTitle', 'Supprimer toutes les données ?')}
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeleteInputText('');
              }}
            >
              {t('common.cancel', 'Annuler')}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteInputText !== 'DELETE'}
              onClick={handleDeleteAll}
            >
              {t('common.confirm', 'Confirmer')}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-app-muted">
            {t('settings.deleteConfirmDesc', 'Cette action effacera toutes les conversations enregistrées. Tapez DELETE pour confirmer.')}
          </p>
          <input
            type="text"
            value={deleteInputText}
            onChange={(e) => setDeleteInputText(e.target.value)}
            placeholder="DELETE"
            className="w-full h-11 px-3 rounded-control border border-app-border-strong text-center font-mono font-bold"
          />
        </div>
      </Modal>
    </div>
  );
};
