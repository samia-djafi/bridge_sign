import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Camera, Mic, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { SessionMode } from '@/types/domain';

export const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings, updateSettings, setUiLanguage } = useSettingsStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'sign' | 'speech' | 'helper'>(settings.role);
  const [selectedMode, setSelectedMode] = useState<SessionMode>('two_way');
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [limitsAck, setLimitsAck] = useState(false);

  const totalSteps = 5;

  const handleFinish = () => {
    updateSettings({
      onboarded: true,
      role: selectedRole,
      lastMode: selectedMode,
      limitationsAckAt: Date.now(),
    });
    navigate('/app');
  };

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setCameraGranted(true);
    } catch {
      setCameraGranted(false);
    }
  };

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicGranted(true);
    } catch {
      setMicGranted(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between p-6 max-w-2xl mx-auto">
      {/* Top Header: Stepper Dots & Skip */}
      <header className="flex items-center justify-between py-2">
        <div
          className="flex items-center gap-2"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Étape ${currentStep} sur ${totalSteps}`}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === currentStep
                  ? 'w-8 bg-app-primary-strong'
                  : s < currentStep
                  ? 'w-2 bg-app-primary'
                  : 'w-2 bg-app-border-strong'
              }`}
            />
          ))}
        </div>

        {currentStep < totalSteps && (
          <button
            type="button"
            onClick={() => setCurrentStep(totalSteps)}
            className="text-xs font-semibold text-app-muted hover:text-app-text"
          >
            {t('onboarding.skip', 'Passer')}
          </button>
        )}
      </header>

      {/* Step Contents */}
      <main className="my-auto py-6">
        {/* STEP 1: Welcome */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            {/* SVG Bridge Visual */}
            <div className="w-48 h-32 flex items-center justify-center">
              <svg viewBox="0 0 200 100" fill="none" className="w-full h-full">
                <circle cx="35" cy="50" r="14" stroke="#0F766E" strokeWidth="3" />
                <path d="M20 85 C20 70, 50 70, 50 85" stroke="#0F766E" strokeWidth="3" />
                <circle cx="165" cy="50" r="14" stroke="#0F766E" strokeWidth="3" />
                <path d="M150 85 C150 70, 180 70, 180 85" stroke="#0F766E" strokeWidth="3" />
                {/* Connecting Arc */}
                <path
                  d="M48 40 C 70 10, 130 10, 152 40"
                  stroke="#2DD4BF"
                  strokeWidth="4"
                  strokeDasharray="4 4"
                />
                <path d="M60 55 C 80 30, 120 30, 140 55" stroke="#0F766E" strokeWidth="3" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text">
                {t('onboarding.welcomeTitle', 'Bienvenue sur LSA Bridge')}
              </h1>
              <p className="text-base text-app-muted max-w-md">
                {t(
                  'onboarding.welcomeSubtitle',
                  'Une passerelle de communication entre la Langue des Signes Algérienne et la parole.'
                )}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Role */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center sm:text-start space-y-1">
              <h1 className="text-2xl font-bold text-app-text">
                {t('onboarding.roleTitle', 'Comment participez-vous à la conversation ?')}
              </h1>
              <p className="text-sm text-app-muted">
                Votre choix adapte la disposition des commandes de l’interface.
              </p>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Rôle dans la conversation">
              <Card
                asButton
                interactive
                selected={selectedRole === 'sign'}
                onClick={() => setSelectedRole('sign')}
                className="flex items-start gap-4 p-4"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  🤟
                </span>
                <div>
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleSign', "J'utilise la langue des signes")}
                  </h3>
                  <p className="text-xs text-app-muted mt-0.5">
                    {t(
                      'onboarding.roleSignDesc',
                      'Interface adaptée avec priorité à la caméra et aux signes'
                    )}
                  </p>
                </div>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedRole === 'speech'}
                onClick={() => setSelectedRole('speech')}
                className="flex items-start gap-4 p-4"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  🗣️
                </span>
                <div>
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleSpeech', 'Je communique par la parole ou le texte')}
                  </h3>
                  <p className="text-xs text-app-muted mt-0.5">
                    {t(
                      'onboarding.roleSpeechDesc',
                      'Interface adaptée avec priorité à la saisie et au retour vocal'
                    )}
                  </p>
                </div>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedRole === 'helper'}
                onClick={() => setSelectedRole('helper')}
                className="flex items-start gap-4 p-4"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">
                  ↔️
                </span>
                <div>
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleHelper', 'J’aide deux personnes à communiquer')}
                  </h3>
                  <p className="text-xs text-app-muted mt-0.5">
                    {t(
                      'onboarding.roleHelperDesc',
                      'Interface équilibrée pour manipuler l’appareil pour les deux'
                    )}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 3: Language */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center sm:text-start space-y-1">
              <h1 className="text-2xl font-bold text-app-text">
                {t('onboarding.langTitle', 'Choisissez votre langue')}
              </h1>
              <p className="text-sm text-app-muted">
                La sélection met à jour instantanément la direction de l’interface (RTL / LTR).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { code: 'fr', flag: '🇫🇷', name: 'Français', sub: 'French' },
                  { code: 'ar', flag: '🇩🇿', name: 'العربية', sub: 'Arabic' },
                  { code: 'en', flag: '🇬🇧', name: 'English', sub: 'Anglais' },
                ] as const
              ).map((lang) => {
                const isSelected = settings.uiLang === lang.code;
                return (
                  <Card
                    key={lang.code}
                    asButton
                    interactive
                    selected={isSelected}
                    onClick={() => setUiLanguage(lang.code)}
                    className="flex flex-col items-center text-center p-5 gap-2"
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <span className="font-bold text-base text-app-text">{lang.name}</span>
                    <span className="text-xs text-app-muted">{lang.sub}</span>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Mode */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center sm:text-start space-y-1">
              <h1 className="text-2xl font-bold text-app-text">
                {t('onboarding.modeTitle', 'Mode de démarrage favori')}
              </h1>
              <p className="text-sm text-app-muted">
                Vous pourrez toujours basculer ou démarrer un autre mode à tout moment.
              </p>
            </div>

            <div className="space-y-3">
              <Card
                asButton
                interactive
                selected={selectedMode === 'two_way'}
                onClick={() => setSelectedMode('two_way')}
                className="p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-app-text">
                    {t('mode.twoWay', 'Conversation à double sens')}
                  </h3>
                  <Badge variant="demo" size="sm">
                    Recommandé
                  </Badge>
                </div>
                <p className="text-xs text-app-muted">
                  {t(
                    'onboarding.modeTwoWayDesc',
                    'Échange complet bidirectionnel (Recommandé pour la clinique/pharmacie)'
                  )}
                </p>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedMode === 'sign_to_language'}
                onClick={() => setSelectedMode('sign_to_language')}
                className="p-4"
              >
                <h3 className="font-bold text-sm text-app-text mb-1">
                  {t('mode.signToLang', 'LSA → Langue')}
                </h3>
                <p className="text-xs text-app-muted">
                  {t(
                    'onboarding.modeSignDesc',
                    'Traduction directe de vos signes vers du texte ou de la parole'
                  )}
                </p>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedMode === 'language_to_sign'}
                onClick={() => setSelectedMode('language_to_sign')}
                className="p-4"
              >
                <h3 className="font-bold text-sm text-app-text mb-1">
                  {t('mode.langToSign', 'Langue → LSA')}
                </h3>
                <p className="text-xs text-app-muted">
                  {t(
                    'onboarding.modeLangDesc',
                    'Traduction de votre parole ou texte vers des clips LSA'
                  )}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 5: Permissions & Limits */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center sm:text-start space-y-1">
              <h1 className="text-2xl font-bold text-app-text">
                {t('onboarding.permissionsTitle', 'Autorisations & limites')}
              </h1>
              <p className="text-sm text-app-muted">
                Vos autorisations permettent d'activer le suivi caméra et l'entrée vocale.
              </p>
            </div>

            {/* Permission rows */}
            <div className="space-y-3">
              {/* Camera row */}
              <div className="p-4 rounded-card bg-app-surface border border-app-border flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-app-text">Caméra</h3>
                    <p className="text-xs text-app-muted mt-0.5 max-w-sm">
                      {t('onboarding.cameraWhy')}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {cameraGranted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-app-success">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('onboarding.granted', 'Autorisé')}
                    </span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={requestCamera}>
                      {t('onboarding.allowCamera', 'Autoriser')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Mic row */}
              <div className="p-4 rounded-card bg-app-surface border border-app-border flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-app-primary-strong shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs text-app-text">Microphone</h3>
                    <p className="text-xs text-app-muted mt-0.5 max-w-sm">
                      {t('onboarding.micWhy')}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {micGranted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-app-success">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('onboarding.granted', 'Autorisé')}
                    </span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={requestMic}>
                      {t('onboarding.allowMic', 'Autoriser')}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Limitations disclaimer check */}
            <div className="p-4 rounded-card bg-amber-50 dark:bg-amber-950/40 border border-app-warning/30 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={limitsAck}
                  onChange={(e) => setLimitsAck(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-app-border-strong text-app-primary-strong focus:ring-app-primary-strong"
                />
                <span className="text-xs text-app-text leading-relaxed font-medium">
                  {t(
                    'onboarding.limitationsAck',
                    'Je comprends que LSA Bridge est un outil expérimental avec un vocabulaire défini et ne remplace pas un interprète humain certifié.'
                  )}
                </span>
              </label>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation: Back / Continue / Finish */}
      <footer className="flex items-center justify-between border-t border-app-border pt-4">
        {currentStep > 1 ? (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            iconStart={<ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('onboarding.back', 'Retour')}
          </Button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            iconEnd={<ArrowRight className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('onboarding.continue', 'Continuer')}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={!limitsAck}
            onClick={handleFinish}
            iconEnd={<CheckCircle2 className="w-4 h-4" />}
          >
            {t('onboarding.finish', 'Commencer')}
          </Button>
        )}
      </footer>
    </div>
  );
};
