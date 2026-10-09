import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/stores/uiStore';
import { useSessionStore } from '@/stores/sessionStore';
import { Sheet } from '@/components/ui/Sheet';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { triggerHaptic } from '@/lib/a11y';
import { Siren, AlertTriangle, Ambulance, Wind, ShieldAlert, HeartCrack, Stethoscope } from 'lucide-react';
import { SEED_PHRASES } from '@/data/phrasebook';
import { Phrase } from '@/types/domain';

export const EmergencySheet: React.FC = () => {
  const { t } = useTranslation();
  const { emergencySheetOpen, setEmergencySheetOpen } = useUiStore();
  const { currentSession, addMessage } = useSessionStore();

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

  const getEmergencyIcon = (gloss: string[]) => {
    const key = gloss[0];
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

  const activeLang = currentSession ? currentSession.spokenLang : 'fr';

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
        subtitle={t('emergency.subtitle', 'Touchez une phrase pour l’afficher en grand à votre interlocuteur.')}
        maxWidth="lg"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {emergencyPhrases.map((phrase) => {
            return (
              <button
                key={phrase.id}
                type="button"
                onClick={() => handlePhraseSelect(phrase)}
                className="flex flex-col items-center justify-center p-4 min-h-[96px] rounded-card border-2 border-app-warning/40 bg-app-surface hover:bg-amber-50 hover:border-app-warning active:scale-95 transition-all text-center gap-2 shadow-1"
              >
                {getEmergencyIcon(phrase.gloss)}
                <span className="text-sm font-bold text-app-text leading-tight">
                  {phrase.text[activeLang]}
                </span>
              </button>
            );
          })}
        </div>
      </Sheet>

      {/* Full-screen Huge Text Modal for Showing to Hearing Person */}
      <Modal
        isOpen={selectedEmergencyPhrase !== null}
        onClose={() => setSelectedEmergencyPhrase(null)}
        title={t('emergency.showToOther', "Montrer à l'autre personne")}
        maxWidth="lg"
      >
        {selectedEmergencyPhrase && (
          <div className="flex flex-col items-center justify-center text-center py-6 px-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-app-warning flex items-center justify-center">
              {getEmergencyIcon(selectedEmergencyPhrase.gloss)}
            </div>

            <div className="space-y-4">
              <h2
                dir="auto"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-app-text tracking-tight leading-snug"
              >
                {selectedEmergencyPhrase.text[activeLang]}
              </h2>

              <p className="text-base text-app-muted">
                {activeLang !== 'fr' && (
                  <span className="block">{selectedEmergencyPhrase.text.fr}</span>
                )}
                {activeLang !== 'ar' && (
                  <span className="block font-arabic" dir="rtl">
                    {selectedEmergencyPhrase.text.ar}
                  </span>
                )}
              </p>
            </div>

            <div className="p-3 bg-app-surface-2 rounded-control border border-app-border text-xs text-app-muted flex items-center gap-2">
              <span className="font-semibold text-app-text">LSA Gloss:</span>
              <span className="font-mono">{selectedEmergencyPhrase.gloss.join(' · ')}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
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
