import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUiStore } from '@/stores/uiStore';
import { registry } from '@/services/registry';
import { StatusBar } from '@/components/domain/StatusBar';
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
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, setUiLanguage, resetSettings } = useSettingsStore();
  const { addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<
    'language' | 'appearance' | 'a11y' | 'camera' | 'audio' | 'ai' | 'privacy'
  >('language');

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
    downloadFile('lsa_bridge_full_backup.json', JSON.stringify(payload, null, 2), 'application/json');
  };

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar title={t('nav.settings', 'Paramètres')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-app-border pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-app-text">{t('nav.settings', 'Paramètres')}</h2>
            <p className="text-xs text-app-muted mt-0.5">
              Préférences d'accessibilité, capteurs et intelligence artificielle.
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
          <nav aria-label="Catégories des paramètres" className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {[
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
                        { value: '100', label: '100% (Standard)' },
                        { value: '125', label: '125% (Grand)' },
                        { value: '150', label: '150% (Très grand)' },
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
                        { value: 'system', label: 'Système' },
                        { value: 'off', label: 'Animations activées' },
                        { value: 'on', label: 'Animations réduites' },
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
                  description="Affiche la glose et la traduction sous chaque clip"
                />

                <Toggle
                  checked={settings.showGloss}
                  onChange={(showGloss) => {
                    updateSettings({ showGloss });
                    triggerSaved();
                  }}
                  label={t('settings.showGlossLabel', 'Afficher les étiquettes de gloses')}
                  description="Montre les identifiants de signes LSA (ex: MAL-DE-TÊTE)"
                />

                <Toggle
                  checked={settings.largeTargets}
                  onChange={(largeTargets) => {
                    updateSettings({ largeTargets });
                    triggerSaved();
                  }}
                  label={t('settings.largeTargetsLabel', 'Grandes cibles tactiles (56px)')}
                  description="Facilite la manipulation sur écran tactile"
                />

                <Toggle
                  checked={settings.haptics}
                  onChange={(haptics) => {
                    updateSettings({ haptics });
                    triggerSaved();
                  }}
                  label={t('settings.hapticsLabel', 'Retour haptique (vibrations)')}
                  description="Vibre lors de la confirmation d’un signe ou d’une alerte"
                />
              </Card>
            )}

            {/* TAB: Camera */}
            {activeTab === 'camera' && (
              <Card p={24} className="space-y-5">
                <Toggle
                  checked={settings.camera.mirror}
                  onChange={(mirror) => {
                    updateSettings({ camera: { ...settings.camera, mirror } });
                    triggerSaved();
                  }}
                  label={t('settings.cameraMirror', 'Effet miroir sur la prévisualisation')}
                  description="Permet de voir ses gestes comme dans un miroir naturel"
                />

                <Toggle
                  checked={settings.camera.showTrackingByDefault}
                  onChange={(showTrackingByDefault) => {
                    updateSettings({
                      camera: { ...settings.camera, showTrackingByDefault },
                    });
                    triggerSaved();
                  }}
                  label="Afficher le suivi IA par défaut"
                  description="Dessine en direct les 21 points squelettiques des mains"
                />
              </Card>
            )}

            {/* TAB: Audio & Speech */}
            {activeTab === 'audio' && (
              <Card p={24} className="space-y-5">
                <Toggle
                  checked={settings.audio.voiceOutput}
                  onChange={(voiceOutput) => {
                    updateSettings({ audio: { ...settings.audio, voiceOutput } });
                    triggerSaved();
                  }}
                  label={t('settings.voiceOutputLabel', 'Sortie vocale automatique')}
                  description="Énonce vocalement les phrases traduites dès leur envoi"
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
                        { value: 'mock', label: 'Mode Démo (Simulation locale)' },
                        { value: 'http', label: 'Serveur HTTP direct (Live backend)' },
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
                  <h3 className="text-base font-bold text-app-text">Stockage des données</h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    Toutes vos conversations et vos paramètres sont stockés localement sur cet appareil via
                    IndexedDB et localStorage.
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
                    <h3 className="text-base font-bold">Zone de danger</h3>
                  </div>
                  <p className="text-xs text-app-muted">
                    La suppression des données locales efface définitivement toutes vos conversations
                    et réinitialise vos préférences.
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
        onClose={() => setDeleteConfirmOpen(false)}
        title="Supprimer toutes les données ?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={deleteInputText !== 'DELETE'}
              onClick={handleDeleteAll}
            >
              Confirmer la suppression
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-app-muted">
            Cette action effacera toutes les conversations enregistrées. Tapez{' '}
            <strong className="text-app-error font-mono">DELETE</strong> pour confirmer.
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
