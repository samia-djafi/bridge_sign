import { useState, useRef, useCallback, useEffect } from 'react';
import { RecognitionState } from '@/components/domain/RecognitionStatus';
import { LandmarkFrame, RecognitionResult, SpokenLang, Translation } from '@/types/domain';
import { registry } from '@/services/registry';
import { logger } from '@/lib/logger';
import { announceToScreenReader } from '@/lib/a11y';

export interface UseRecognitionMachineProps {
  spokenLang: SpokenLang;
  onRecognized?: (result: RecognitionResult) => void;
}

export function useRecognitionMachine({ spokenLang, onRecognized }: UseRecognitionMachineProps) {
  const [state, setState] = useState<RecognitionState>('camera_ready');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [recognizedResult, setRecognizedResult] = useState<RecognitionResult | null>(null);
  const [proposedSentence, setProposedSentence] = useState<Translation | null>(null);
  const [noHandsWarning, setNoHandsWarning] = useState(false);

  const framesBufferRef = useRef<LandmarkFrame[]>([]);
  const handsAbsentTimerRef = useRef<any>(null);
  const maxUtteranceTimerRef = useRef<any>(null);
  const noHandsTimerRef = useRef<any>(null);
  const isTrackingHandsRef = useRef(false);

  const transitionTo = useCallback((nextState: RecognitionState, announceText?: string) => {
    setState(nextState);
    if (announceText) {
      announceToScreenReader(announceText, 'polite');
    }
  }, []);

  const resetTimers = () => {
    if (handsAbsentTimerRef.current) clearTimeout(handsAbsentTimerRef.current);
    if (maxUtteranceTimerRef.current) clearTimeout(maxUtteranceTimerRef.current);
    if (noHandsTimerRef.current) clearTimeout(noHandsTimerRef.current);
  };

  const finalizeRecognition = useCallback(async () => {
    resetTimers();
    transitionTo('processing', 'Interprétation en cours');

    try {
      const result = await registry.ai.recognition.finalize();

      if (!result.signs || result.signs.length === 0 || result.level === 'low') {
        transitionTo('low_confidence', "Reconnaissance incertaine. Veuillez répéter le signe.");
        setRecognizedResult(result);
        return;
      }

      // Generate sentence
      const translation = await registry.languageGeneration.glossToSentence(result.sequence);

      setRecognizedResult(result);
      setProposedSentence(translation);
      transitionTo('recognized', 'Message reconnu avec succès');
      onRecognized?.(result);
      logger.info('Utterance recognized', { sequence: result.sequence, confidence: result.overallConfidence });
    } catch (err: any) {
      setErrorMessage(err.message || 'AI-004');
      transitionTo('error', 'Erreur lors de la reconnaissance');
      logger.error('Recognition finalize failed', err.code || 'AI-004', err);
    }
  }, [transitionTo, onRecognized]);

  const startRecognition = useCallback(async () => {
    framesBufferRef.current = [];
    setRecognizedResult(null);
    setProposedSentence(null);
    setNoHandsWarning(false);
    isTrackingHandsRef.current = false;

    await registry.ai.recognition.start({ lang: spokenLang });
    transitionTo('recognizing', 'Reconnaissance démarrée. Gardez vos mains visibles.');

    // 3s no-hands warning timer
    noHandsTimerRef.current = setTimeout(() => {
      if (!isTrackingHandsRef.current) {
        setNoHandsWarning(true);
        announceToScreenReader('Mains non détectées. Placez-les dans le cadre.', 'polite');
      }
    }, 3000);

    // 12s maximum utterance auto-finalize timer
    maxUtteranceTimerRef.current = setTimeout(() => {
      finalizeRecognition();
    }, 12000);
  }, [spokenLang, transitionTo, finalizeRecognition]);

  const stopRecognition = useCallback(() => {
    if (state === 'recognizing' || state === 'capturing') {
      finalizeRecognition();
    } else {
      resetTimers();
      transitionTo('camera_ready');
    }
  }, [state, finalizeRecognition, transitionTo]);

  // Push incoming landmark frame from camera/tracking
  const pushFrame = useCallback(
    (frame: LandmarkFrame) => {
      if (state !== 'recognizing' && state !== 'capturing') return;

      const hasHands = frame.hands && frame.hands.length > 0;

      if (hasHands) {
        isTrackingHandsRef.current = true;
        setNoHandsWarning(false);

        if (state === 'recognizing') {
          transitionTo('capturing');
        }

        framesBufferRef.current.push(frame);
        registry.ai.recognition.push(frame);

        // Reset absence timer
        if (handsAbsentTimerRef.current) clearTimeout(handsAbsentTimerRef.current);
      } else {
        // Hands absent
        if (state === 'capturing' && framesBufferRef.current.length >= 8) {
          // If absent for >= 800ms, finalize
          if (!handsAbsentTimerRef.current) {
            handsAbsentTimerRef.current = setTimeout(() => {
              finalizeRecognition();
            }, 800);
          }
        }
      }
    },
    [state, transitionTo, finalizeRecognition]
  );

  const resetToReady = useCallback(() => {
    resetTimers();
    setRecognizedResult(null);
    setProposedSentence(null);
    setNoHandsWarning(false);
    transitionTo('camera_ready');
  }, [transitionTo]);

  useEffect(() => {
    return () => {
      resetTimers();
    };
  }, []);

  return {
    state,
    errorMessage,
    recognizedResult,
    proposedSentence,
    noHandsWarning,
    startRecognition,
    stopRecognition,
    finalizeRecognition,
    pushFrame,
    resetToReady,
    setProposedSentence,
  };
}
