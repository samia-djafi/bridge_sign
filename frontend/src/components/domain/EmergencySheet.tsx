import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/stores/uiStore';
import { useSessionStore } from '@/stores/sessionStore';
import { Sheet } from '@/components/ui/Sheet';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { triggerHaptic } from '@/lib/a11y';
import { Siren, AlertTriangle, Ambulance, Wind, ShieldAlert, HeartCrack, Stethoscope, PhoneCall, Pill } from 'lucide-react';
import { SEED_PHRASES } from '@/data/phrasebook';
import { Phrase, UiLang } from '@/types/domain';
import { useSettingsStore } from '@/stores/settingsStore';

export const EmergencySheet: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { emergencySheetOpen, setEmergencySheetOpen } = useUiStore();
  const { currentSession, addMessage } = useSessionStore();
  const { settings } = useSettingsStore();

  const [selectedEmergencyPhrase, setSelectedEmergencyPhrase] = useState<Phrase | null>(null);

  const emergencyPhrases = SEED_PHRASES.filter((p) => p.emergency);

  const handlePhraseSelect = async (phrase: Phrase) => {
    triggerHaptic(50);
    setSelectedEmergencyPhrase(phrase);

    if (currentSession && currentSession.status === 'active') {
      await addMessage({
        direction: 'sign_to_language',
        source: 'lsa',
        originalInput: phrase.gloss,
        outputs: phrase.text,
        gloss: phrase.gloss,
        displayLang: currentSession.spokenLang,
        confidence: 1.0,
        level: 'high',
        edited: false,
      });
    }
  };

  const getEmergencyIcon = (phrase: Phrase) => {
    if (phrase.id === 'ph_emergency_contact') {
      return <PhoneCall className="w-8 h-8 text-app-warning" />;
    }
    if (phrase.id === 'ph_allergy_emergency') {
      return <Pill className="w-8 h-8 text-app-error" />;
    }
    const key = phrase.gloss[0];
    switch (key) {
      case 'HELP':
        return <ShieldAlert className="w-8 h-8 text-app-warning" />;
      case 'AMBULANCE':
        return <Ambulance className="w-8 h-8 text-app-error" />;
      case 'BREATHE':
        return <Wind className="w-8 h-8 text-app-warning" />;
      case 'INJURED':
        return <AlertTriangle className="w-8 h-8 text-app-warning" />;
      case 'BLOOD':
        return <HeartCrack className="w-8 h-8 text-app-error" />;
      case 'DOCTOR':
        return <Stethoscope className="w-8 h-8 text-app-error" />;
      default:
        return <Siren className="w-8 h-8 text-app-warning" />;
    }
  };

  const activeLang: UiLang = (currentSession?.spokenLang || settings.uiLang || (i18n.language as UiLang) || 'en');

  return (
    <>
      <Sheet
        isOpen={emergencySheetOpen}
        onClose={() => setEmergencySheetOpen(false)}
        title={
          <div className="flex items-center gap-2 text-app-warning">
            <Siren className="w-5 h-5" />
            <span>{t('emergency.title', "Phrases d'urgence")}</span>
          </div>
        }
        subtitle={t('emergency.subtitle', 'Tap a phrase to show it large to your interlocutor.')}
        maxWidth="4xl"
      >
        <div className="space-y-3">
          <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-control text-xs text-app-muted leading-relaxed flex items-center gap-2">
            <span className="font-bold text-app-text shrink-0">{t('emergency.essentialsTitle', 'Medical Essentials')}:</span>
            <span>{t('emergency.essentialsDesc', 'Pre-verified offline cards available immediately without requiring AI processing.')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {emergencyPhrases.map((phrase) => {
              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => handlePhraseSelect(phrase)}
                  className="flex flex-col items-center justify-center p-3 sm:p-3.5 min-h-[82px] sm:min-h-[88px] rounded-card border-2 border-app-warning/50 dark:border-app-warning/40 bg-app-surface hover:bg-amber-500/10 dark:hover:bg-amber-500/15 hover:border-app-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong active:scale-95 transition-all text-center gap-1.5 shadow-1"
                >
                  <div className="shrink-0 scale-90 sm:scale-100">
                    {getEmergencyIcon(phrase)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-app-text leading-snug">
                    {phrase.text[activeLang] || phrase.text.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Sheet>

      {/* Full-screen Huge Text Modal for Showing to Hearing Person */}
      <Modal
        isOpen={selectedEmergencyPhrase !== null}
        onClose={() => setSelectedEmergencyPhrase(null)}
        title={t('emergency.showToOther', "Show to the other person")}
        maxWidth="xl"
      >
        {selectedEmergencyPhrase && (
          <div className="flex flex-col items-center justify-center text-center py-2 sm:py-3 px-1 sm:px-4 space-y-4 sm:space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-app-warning flex items-center justify-center shrink-0">
              {getEmergencyIcon(selectedEmergencyPhrase)}
            </div>

            <div className="space-y-2 w-full max-w-xl mx-auto">
              <h2
                dir="auto"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-app-text tracking-tight leading-snug px-1"
              >
                {selectedEmergencyPhrase.text[activeLang] || selectedEmergencyPhrase.text.en}
              </h2>

              <div className="text-xs sm:text-sm text-app-muted space-y-0.5">
                {activeLang !== 'en' && selectedEmergencyPhrase.text.en && (
                  <span className="block font-medium">{selectedEmergencyPhrase.text.en}</span>
                )}
                {activeLang !== 'fr' && selectedEmergencyPhrase.text.fr && (
                  <span className="block">{selectedEmergencyPhrase.text.fr}</span>
                )}
                {activeLang !== 'ar' && selectedEmergencyPhrase.text.ar && (
                  <span className="block font-arabic" dir="rtl">
                    {selectedEmergencyPhrase.text.ar}
                  </span>
                )}
              </div>
            </div>

            <div className="p-2 sm:p-2.5 bg-app-surface-2 rounded-control border border-app-border text-xs text-app-muted flex items-center gap-2">
              <span className="font-semibold text-app-text">{t('emergency.glossLabel', 'LSA Gloss:')}</span>
              <span className="font-mono">{selectedEmergencyPhrase.gloss.join(' · ')}</span>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setSelectedEmergencyPhrase(null);
                setEmergencySheetOpen(false);
              }}
            >
              {t('emergency.done', 'Fermer / Terminé')}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};
