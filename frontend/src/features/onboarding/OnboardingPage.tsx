import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Camera, Mic, CheckCircle2, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { SessionMode } from '@/types/domain';

export const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings, updateSettings, setUiLanguage } = useSettingsStore();
  const { preferredName: storedPreferredName, setPreferredName } = useProfileStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [preferredNameInput, setPreferredNameInput] = useState(storedPreferredName || '');
  const [nameError, setNameError] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState<'sign' | 'speech' | 'helper'>(settings.role);
  const [selectedMode, setSelectedMode] = useState<SessionMode>('two_way');
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [limitsAck, setLimitsAck] = useState(false);

  const totalSteps = 5;

  const handleSaveNameAndContinue = () => {
    const trimmed = preferredNameInput.trim();
    if (preferredNameInput.length > 0 && trimmed.length === 0) {
      setNameError(t('onboarding.nameWhitespaceError', 'Veuillez entrer un nom valide ou ignorer cette étape.'));
      return;
    }
    setNameError(null);
    setPreferredName(trimmed.length > 0 ? trimmed : null);
    setCurrentStep((prev) => prev + 1);
  };

  const handleSkipName = () => {
    setNameError(null);
    setPreferredName(null);
    setCurrentStep((prev) => prev + 1);
  };

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

  // Move Language selection to Step 2 so users can explicitly set language right after welcome
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto selection:bg-teal-500/20">
      {/* Top Header: Stepper Dots & Skip */}
      <header className="flex items-center justify-between py-3 px-2 border-b border-app-border/60">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={t('onboarding.step', { current: currentStep, total: totalSteps })}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === currentStep
                    ? 'w-9 bg-[#0D9488]'
                    : s < currentStep
                    ? 'w-2.5 bg-teal-600/70'
                    : 'w-2 bg-app-border-strong'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-app-muted">
            {currentStep} / {totalSteps}
          </span>
        </div>

        {currentStep < totalSteps && (
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) {
                // If skipping from step 1, preserve anonymous profile
                handleSkipName();
              }
              setCurrentStep(totalSteps);
            }}
            className="text-xs font-semibold text-app-muted hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded px-2.5 py-1 transition-colors"
          >
            {t('onboarding.skip', 'Skip')}
          </button>
        )}
      </header>

      {/* Step Contents */}
      <main className="my-auto py-8">
        {/* STEP 1: Welcome & Preferred Name */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in max-w-lg mx-auto">
            {/* Official Brand Logo Mark */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2 border border-teal-500/20 bg-[#0F2229] p-1.5 flex items-center justify-center">
                <img
                  src="/icons/logo-mark.png"
                  alt="BridgeSign Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Product branding */}
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest uppercase text-[#0D9488]">
                BridgeSign
              </span>
              <p className="text-xs text-app-muted italic">
                {t('app.tagline', 'Every Hand Has a Voice.')}
              </p>
            </div>

            {/* Main content headings */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
                {t('onboarding.makeYoursHeading', "Let's make this yours.")}
              </h1>
              <p className="text-sm font-semibold text-[#0D9488]">
                {t('onboarding.whatIsYourName', "What's your name?")}
              </p>
              <p className="text-xs sm:text-sm text-app-muted max-w-sm mx-auto leading-relaxed">
                {t('onboarding.whatToCallYou', 'What would you like us to call you?')}
              </p>
            </div>

            {/* Name Input with validation & keyboard submit */}
            <div className="w-full space-y-2 text-start bg-app-surface p-5 sm:p-6 rounded-card border border-app-border shadow-1">
              <label htmlFor="preferred-name-input" className="sr-only">
                {t('onboarding.whatIsYourName', "What's your name?")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-app-muted">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="preferred-name-input"
                  type="text"
                  value={preferredNameInput}
                  onChange={(e) => {
                    setPreferredNameInput(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNameAndContinue();
                    }
                  }}
                  placeholder={t('onboarding.namePlaceholder', 'Enter your preferred name')}
                  className={`w-full h-11 ps-10 pe-4 rounded-control bg-app-surface-2 border text-sm text-app-text placeholder:text-app-muted focus-visible:outline-none focus-visible:ring-2 transition-all ${
                    nameError
                      ? 'border-app-error focus-visible:ring-app-error'
                      : 'border-app-border focus-visible:ring-[#0D9488]'
                  }`}
                  aria-invalid={nameError ? 'true' : 'false'}
                  aria-describedby={nameError ? 'name-error-message' : undefined}
                  autoComplete="off"
                />
              </div>

              {nameError && (
                <p id="name-error-message" className="text-xs text-app-error font-medium" role="alert">
                  {nameError}
                </p>
              )}

              {/* Action buttons inside Step 1 */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 w-full">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleSaveNameAndContinue}
                  iconEnd={<ArrowRight className="w-4 h-4 rtl:-scale-x-100" />}
                >
                  {t('onboarding.continue', 'Continue')}
                </Button>
                <button
                  type="button"
                  onClick={handleSkipName}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-app-muted hover:text-app-text transition-colors rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] text-center"
                >
                  {t('onboarding.skipForNow', 'Skip for now')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Language Selection (Promoted early so whole onboarding is personalized) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center sm:text-start space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                {t('onboarding.step', { current: 2, total: totalSteps })}
              </span>
              <h1 className="text-2xl font-bold text-app-text tracking-tight">
                {t('onboarding.langTitle', 'Choose your language')}
              </h1>
              <p className="text-sm text-app-muted leading-relaxed">
                {t('onboarding.langSubtitle', 'Selection immediately updates layout direction (RTL / LTR).')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {(
                [
                  { code: 'en', flag: '🇬🇧', name: 'English', sub: 'English' },
                  { code: 'fr', flag: '🇫🇷', name: 'Français', sub: 'French' },
                  { code: 'ar', flag: '🇩🇿', name: 'العربية', sub: 'Arabic' },
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
                    className={`flex flex-col items-center text-center p-5 gap-2 rounded-card border transition-all ${
                      isSelected
                        ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                        : 'border-app-border hover:border-app-border-strong'
                    }`}
                  >
                    <span className="text-3xl select-none" aria-hidden="true">
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

        {/* STEP 3: Role */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center sm:text-start space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                {t('onboarding.step', { current: 3, total: totalSteps })}
              </span>
              <h1 className="text-2xl font-bold text-app-text tracking-tight">
                {t('onboarding.roleTitle', 'How do you participate in the conversation?')}
              </h1>
              <p className="text-sm text-app-muted leading-relaxed">
                {t('onboarding.whatToCallYou', 'Your choice adapts the workspace layout.')}
              </p>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label={t('onboarding.roleTitle', 'Role in conversation')}>
              <Card
                asButton
                interactive
                selected={selectedRole === 'sign'}
                onClick={() => setSelectedRole('sign')}
                className={`flex items-start gap-4 p-4.5 rounded-card border transition-all ${
                  selectedRole === 'sign'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <div className="w-11 h-11 rounded-control bg-app-surface-2 flex items-center justify-center shrink-0 text-2xl" aria-hidden="true">
                  🤟
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleSign', "I use sign language")}
                  </h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    {t(
                      'onboarding.roleSignDesc',
                      'Customized interface prioritizing camera and sign detection'
                    )}
                  </p>
                </div>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedRole === 'speech'}
                onClick={() => setSelectedRole('speech')}
                className={`flex items-start gap-4 p-4.5 rounded-card border transition-all ${
                  selectedRole === 'speech'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <div className="w-11 h-11 rounded-control bg-app-surface-2 flex items-center justify-center shrink-0 text-2xl" aria-hidden="true">
                  🗣️
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleSpeech', 'I communicate through speech or text')}
                  </h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    {t(
                      'onboarding.roleSpeechDesc',
                      'Customized interface prioritizing typing and audio output'
                    )}
                  </p>
                </div>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedRole === 'helper'}
                onClick={() => setSelectedRole('helper')}
                className={`flex items-start gap-4 p-4.5 rounded-card border transition-all ${
                  selectedRole === 'helper'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <div className="w-11 h-11 rounded-control bg-app-surface-2 flex items-center justify-center shrink-0 text-2xl" aria-hidden="true">
                  ↔️
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-app-text">
                    {t('onboarding.roleHelper', 'I am helping two people communicate')}
                  </h3>
                  <p className="text-xs text-app-muted leading-relaxed">
                    {t(
                      'onboarding.roleHelperDesc',
                      'Balanced interface to operate the device for both'
                    )}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 4: Mode */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center sm:text-start space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                {t('onboarding.step', { current: 4, total: totalSteps })}
              </span>
              <h1 className="text-2xl font-bold text-app-text tracking-tight">
                {t('onboarding.modeTitle', 'Preferred starting mode')}
              </h1>
              <p className="text-sm text-app-muted leading-relaxed">
                {t('onboarding.modeSubtitle', 'You can always switch or start a different mode at any time.')}
              </p>
            </div>

            <div className="space-y-3">
              <Card
                asButton
                interactive
                selected={selectedMode === 'two_way'}
                onClick={() => setSelectedMode('two_way')}
                className={`p-4.5 rounded-card border transition-all ${
                  selectedMode === 'two_way'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-app-text">
                    {t('mode.twoWay', 'Two-way conversation')}
                  </h3>
                  <Badge variant="demo" size="sm">
                    {t('dash.recommended', 'Recommended')}
                  </Badge>
                </div>
                <p className="text-xs text-app-muted leading-relaxed">
                  {t(
                    'onboarding.modeTwoWayDesc',
                    'Full bidirectional exchange (Recommended for clinic / pharmacy)'
                  )}
                </p>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedMode === 'sign_to_language'}
                onClick={() => setSelectedMode('sign_to_language')}
                className={`p-4.5 rounded-card border transition-all ${
                  selectedMode === 'sign_to_language'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <h3 className="font-bold text-sm text-app-text mb-1">
                  {t('mode.signToLang', 'Sign → Language')}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {t(
                    'onboarding.modeSignDesc',
                    'Direct translation from your signs to text or speech'
                  )}
                </p>
              </Card>

              <Card
                asButton
                interactive
                selected={selectedMode === 'language_to_sign'}
                onClick={() => setSelectedMode('language_to_sign')}
                className={`p-4.5 rounded-card border transition-all ${
                  selectedMode === 'language_to_sign'
                    ? 'border-[#0D9488] ring-1 ring-[#0D9488] bg-teal-500/5'
                    : 'border-app-border hover:border-app-border-strong'
                }`}
              >
                <h3 className="font-bold text-sm text-app-text mb-1">
                  {t('mode.langToSign', 'Language → Sign')}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {t(
                    'onboarding.modeLangDesc',
                    'Translation from your speech or text to LSA sign clips'
                  )}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 5: Permissions & Limits */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center sm:text-start space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                {t('onboarding.step', { current: 5, total: totalSteps })}
              </span>
              <h1 className="text-2xl font-bold text-app-text tracking-tight">
                {t('onboarding.permissionsTitle', 'Permissions & limitations')}
              </h1>
              <p className="text-sm text-app-muted leading-relaxed">
                {t('onboarding.permissionsSubtitle', 'Your permissions enable camera tracking and voice input.')}
              </p>
            </div>

            {/* Permission rows */}
            <div className="space-y-3">
              {/* Camera row */}
              <div className="p-4 sm:p-5 rounded-card bg-app-surface border border-app-border flex items-center justify-between gap-4 shadow-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-control bg-teal-500/10 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-app-text">
                      {t('onboarding.cameraTitle', 'Camera')}
                    </h3>
                    <p className="text-xs text-app-muted mt-0.5 max-w-sm leading-relaxed">
                      {t('onboarding.cameraWhy')}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {cameraGranted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-pill">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('onboarding.granted', 'Granted')}
                    </span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={requestCamera}>
                      {t('onboarding.allowCamera', 'Allow camera')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Mic row */}
              <div className="p-4 sm:p-5 rounded-card bg-app-surface border border-app-border flex items-center justify-between gap-4 shadow-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-control bg-teal-500/10 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-app-text">
                      {t('onboarding.micTitle', 'Microphone')}
                    </h3>
                    <p className="text-xs text-app-muted mt-0.5 max-w-sm leading-relaxed">
                      {t('onboarding.micWhy')}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {micGranted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-pill">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('onboarding.granted', 'Granted')}
                    </span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={requestMic}>
                      {t('onboarding.allowMic', 'Allow microphone')}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Limitations disclaimer check */}
            <div className="p-4 sm:p-5 rounded-card bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-700/30 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={limitsAck}
                  onChange={(e) => setLimitsAck(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-app-border-strong text-[#0D9488] focus:ring-[#0D9488]"
                />
                <span className="text-xs text-app-text leading-relaxed font-medium">
                  {t(
                    'onboarding.limitationsAck',
                    'I understand that BridgeSign is an experimental tool with a defined vocabulary and does not replace a certified human interpreter.'
                  )}
                </span>
              </label>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation: Back / Continue / Finish */}
      <footer className="flex items-center justify-between border-t border-app-border pt-4">
        {currentStep === 1 ? (
          <div>
            <button
              type="button"
              onClick={handleSkipName}
              className="text-xs font-semibold text-app-muted hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong rounded px-2 py-1"
            >
              {t('onboarding.skipForNow', 'Skip for now')}
            </button>
          </div>
        ) : currentStep > 1 ? (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            iconStart={<ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('onboarding.back', 'Back')}
          </Button>
        ) : (
          <div />
        )}

        {currentStep === 1 ? (
          <Button
            variant="primary"
            onClick={handleSaveNameAndContinue}
            iconEnd={<ArrowRight className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('onboarding.continue', 'Continue')}
          </Button>
        ) : currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            iconEnd={<ArrowRight className="w-4 h-4 rtl:-scale-x-100" />}
          >
            {t('onboarding.continue', 'Continue')}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={!limitsAck}
            onClick={handleFinish}
            iconEnd={<CheckCircle2 className="w-4 h-4" />}
          >
            {t('onboarding.finish', 'Start')}
          </Button>
        )}
      </footer>
    </div>
  );
};
