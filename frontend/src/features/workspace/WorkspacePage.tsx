import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUiStore } from '@/stores/uiStore';
import { useDemoStore } from '@/stores/demoStore';
import { useCamera } from '@/hooks/useCamera';
import { useRecognitionMachine } from '@/hooks/useRecognitionMachine';
import { registry } from '@/services/registry';
import { SignClip, SpokenLang, Translation, Phrase } from '@/types/domain';
import { formatDuration } from '@/lib/time';
import { downloadFile } from '@/lib/download';
import { triggerHaptic } from '@/lib/a11y';

// Components
import { CameraPanel } from '@/components/domain/CameraPanel';
import { RecognitionStatus } from '@/components/domain/RecognitionStatus';
import { DetectedSignChip } from '@/components/domain/DetectedSignChip';
import { SentenceCard } from '@/components/domain/SentenceCard';
import { ConversationMessage as MessageItem } from '@/components/domain/ConversationMessage';
import { SignPlayer } from '@/components/domain/SignPlayer';
import { DemoCoach } from '@/components/domain/DemoCoach';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Sheet } from '@/components/ui/Sheet';
import { Modal } from '@/components/ui/Modal';
import { PhraseCard } from '@/components/domain/PhraseCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import {
  ArrowLeft,
  Pause,
  Play,
  StopCircle,
  Siren,
  Download,
  Trash2,
  Edit2,
  Check,
  Radio,
  Mic,
  BookOpen,
  Send,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    currentSession,
    messages,
    status,
    activeMs,
    loadSession,
    pauseSession,
    resumeSession,
    endSession,
    addMessage,
    editMessage,
    setSpokenLang,
    updateSessionTitle,
    clearSessionMessages,
  } = useSessionStore();

  const { settings, updateSettings } = useSettingsStore();
  const { addToast, setEmergencySheetOpen, setPrivacySheetOpen } = useUiStore();
  const { isDemoActive, getCurrentStep, nextStep } = useDemoStore();

  // Mobile navigation tabs
  const [mobileTab, setMobileTab] = useState<'sign' | 'speech' | 'conversation'>('sign');
  const [unreadMessages, setUnreadMessages] = useState(false);

  // Modals & Sheets
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [isClearingMessages, setIsClearingMessages] = useState(false);
  const [phrasePickerOpen, setPhrasePickerOpen] = useState(false);
  const [conversationDrawerOpen, setConversationDrawerOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  // Right panel (Language composer) state
  const [composerMode, setComposerMode] = useState<'type' | 'speak'>('type');
  const [composerText, setComposerText] = useState('');
  const [sttListening, setSttListening] = useState(false);
  const [translatedClips, setTranslatedClips] = useState<SignClip[]>([]);
  const [composerSuggestions, setComposerSuggestions] = useState<Phrase[]>([]);

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Camera & recognition hooks
  const camera = useCamera();

  const recognition = useRecognitionMachine({
    spokenLang: currentSession?.spokenLang || 'fr',
    onRecognized: () => {
      triggerHaptic(40);
    },
  });

  // Load session from DB
  useEffect(() => {
    if (!sessionId) return;
    loadSession(sessionId).then((found) => {
      if (!found) {
        addToast({ message: 'Conversation introuvable', type: 'alert' });
        navigate('/app/history');
      }
    });
  }, [sessionId, loadSession, navigate, addToast]);

  // Load context phrases for quick suggestions
  useEffect(() => {
    registry.phrasebook.list().then((list) => {
      const filtered = list.filter((p) => p.contexts.includes(currentSession?.context || 'healthcare'));
      setComposerSuggestions(filtered.slice(0, 3));
    });
  }, [currentSession?.context]);

  // Handle prefilled phrase from URL
  useEffect(() => {
    const phraseId = searchParams.get('phrase');
    if (!phraseId) return;

    registry.phrasebook.list().then((phrases) => {
      const p = phrases.find((item) => item.id === phraseId);
      if (p && currentSession) {
        setComposerText(p.text[currentSession.spokenLang] || p.text.fr);
      }
    });
  }, [searchParams, currentSession]);

  // Handle timeline scroll bottom detection
  const handleTimelineScroll = () => {
    const container = timelineRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBottom(distanceToBottom > 80);
  };

  const scrollToBottom = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: timelineRef.current.scrollHeight, behavior: 'smooth' });
    }
    setShowScrollBottom(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Right Panel: Translate text to LSA
  const handleTranslateToLsa = async (textToTranslate?: string) => {
    const text = textToTranslate || composerText;
    if (!text.trim() || !currentSession) return;

    const result = await registry.textToSign.sentenceToGloss(text, currentSession.spokenLang);

    if (result.gloss.length === 0) {
      addToast({
        message: t('err.outOfVocab', 'Cette phrase est en dehors du vocabulaire actuel.'),
        type: 'alert',
      });
      return;
    }

    const clips = await registry.signAssets.getClips(result.gloss);
    setTranslatedClips(clips);

    // Auto log message to conversation
    if (settings.privacy.autoLogMessages) {
      await addMessage({
        direction: 'language_to_sign',
        source: currentSession.spokenLang,
        originalInput: text,
        outputs: {
          fr: text,
          ar: text,
          en: text,
        },
        gloss: result.gloss,
        displayLang: currentSession.spokenLang,
        confidence: 1.0,
        level: 'high',
        edited: false,
      });

      addToast({
        message: t('composer.addedToConversation', 'Ajouté à la conversation'),
        type: 'success',
      });
    }

    if (isDemoActive) {
      nextStep();
    }
  };

  // Right Panel: STT Voice input
  const toggleSpeechRecognition = () => {
    if (!currentSession) return;
    const speech = registry.speech;

    if (sttListening) {
      speech.stt.stop();
      setSttListening(false);
    } else {
      setSttListening(true);
      speech.stt.start({
        lang: currentSession.spokenLang,
        onInterim: (text) => setComposerText(text),
        onFinal: (text) => {
          setComposerText(text);
          setSttListening(false);
          handleTranslateToLsa(text);
        },
        onError: () => {
          setSttListening(false);
          addToast({ message: t('err.mic', 'Erreur microphone'), type: 'alert' });
        },
      });
    }
  };

  // Advertised Workspace Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      // Escape: Dismiss active modals/sheets or stop speech input
      if (e.key === 'Escape') {
        if (clearConfirmOpen) {
          setClearConfirmOpen(false);
          return;
        }
        if (endConfirmOpen) {
          setEndConfirmOpen(false);
          return;
        }
        if (phrasePickerOpen) {
          setPhrasePickerOpen(false);
          return;
        }
        if (sttListening) {
          toggleSpeechRecognition();
          return;
        }
        if (isInput && activeEl instanceof HTMLElement) {
          activeEl.blur();
          return;
        }
      }

      // Space: Toggle Camera (Only outside input fields and buttons)
      if (e.key === ' ' || e.code === 'Space') {
        if (isInput || activeEl instanceof HTMLButtonElement) {
          return;
        }
        e.preventDefault();
        if (camera.status === 'active') {
          camera.stopCamera();
          addToast({ message: 'Caméra désactivée (Espace)', type: 'status' });
        } else {
          camera.startCamera();
          addToast({ message: 'Caméra activée (Espace)', type: 'status' });
        }
        return;
      }

      // Alt key combinations
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'e') {
          e.preventDefault();
          setEmergencySheetOpen(true);
          addToast({ message: 'Phrases d’urgence (Alt+E)', type: 'status' });
        } else if (k === 'm') {
          e.preventDefault();
          toggleSpeechRecognition();
        } else if (k === 'p') {
          e.preventDefault();
          setPrivacySheetOpen(true);
          addToast({ message: 'Confidentialité & Aide (Alt+P)', type: 'status' });
        } else if (k === 'r') {
          e.preventDefault();
          setPhrasePickerOpen((prev) => !prev);
        } else if (k === 't') {
          e.preventDefault();
          setComposerMode('type');
          setTimeout(() => {
            composerTextareaRef.current?.focus();
          }, 50);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    clearConfirmOpen,
    endConfirmOpen,
    phrasePickerOpen,
    sttListening,
    camera.status,
    camera.startCamera,
    camera.stopCamera,
    setEmergencySheetOpen,
    setPrivacySheetOpen,
    addToast,
    toggleSpeechRecognition,
  ]);

  // Left Panel: Send proposed sentence from LSA
  const handleSendProposed = async (sentence: Translation, displayLang: SpokenLang) => {
    if (!currentSession || !recognition.recognizedResult) return;

    await addMessage({
      direction: 'sign_to_language',
      source: 'lsa',
      originalInput: recognition.recognizedResult.sequence,
      outputs: sentence,
      gloss: recognition.recognizedResult.sequence,
      displayLang,
      confidence: recognition.recognizedResult.overallConfidence,
      level: recognition.recognizedResult.level,
      edited: false,
      interpretation: {
        recognizedSigns: recognition.recognizedResult.signs,
        frames: recognition.recognizedResult.frames,
        latencyMs: recognition.recognizedResult.latencyMs,
        model: recognition.recognizedResult.model.name,
        adapter: registry.ai.adapter,
      },
    });

    // Voice output policy
    if (settings.audio.voiceOutput) {
      registry.speech.tts.speak({
        text: sentence[displayLang],
        lang: displayLang,
      });
    }

    recognition.resetToReady();

    if (isDemoActive) {
      nextStep();
    }
  };

  // Single simulate sign action in demo
  const handleSimulateSign = () => {
    const step = getCurrentStep();
    if (step?.simulatedSigns) {
      registry.mockRecognition.setScriptedResult({
        signs: step.simulatedSigns,
        sequence: step.simulatedSigns.map((s) => s.gloss),
        overallConfidence: 0.95,
        level: 'high',
        frames: 36,
        latencyMs: 320,
        model: { name: 'LSA-Sequence-TCN-Lite', version: '0.1.0-mvp' },
        adapter: 'demo',
      });
    }
    recognition.startRecognition();
    setTimeout(() => {
      recognition.stopRecognition();
    }, 1200);
  };

  // Export Session
  const handleExport = async (format: 'txt' | 'json') => {
    if (!sessionId) return;
    const data = await registry.sessions.exportSession(sessionId);

    if (format === 'json') {
      downloadFile(
        `lsa_conversation_${sessionId}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
    } else {
      const lines = data.messages.map(
        (m) =>
          `[${new Date(m.createdAt).toLocaleTimeString()}] ${
            m.direction === 'sign_to_language' ? 'LSA (Signeur)' : 'Interlocuteur'
          }: ${m.outputs[data.session.spokenLang]} (Glose: ${m.gloss.join(' ')})`
      );
      const text = `CONVERSATION BRIDGESIGN\nTitre: ${data.session.title}\nDate: ${new Date(
        data.session.startedAt
      ).toLocaleString()}\n\n${lines.join('\n')}`;
      downloadFile(`bridgesign_conversation_${sessionId}.txt`, text, 'text/plain');
    }
  };

  if (!currentSession) {
    return <div className="p-8 text-center text-app-muted">Chargement de la session…</div>;
  }

  const role = settings.role;
  const colRatio =
    role === 'sign' ? 'lg:grid-cols-[1.15fr_0.85fr]' : role === 'speech' ? 'lg:grid-cols-[0.85fr_1.15fr]' : 'lg:grid-cols-2';

  return (
    <div className="flex flex-col h-full bg-app-bg text-app-text overflow-hidden">
      {/* Workspace Header Chrome */}
      <header className="h-14 bg-app-surface border-b border-app-border px-4 flex items-center justify-between gap-3 shrink-0 select-none z-10">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await pauseSession();
              navigate('/app');
            }}
            iconStart={<ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />}
          >
            <span className="hidden sm:inline">Accueil</span>
          </Button>

          <div className="flex items-center gap-2 truncate">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="px-2 py-0.5 rounded border border-app-border-strong text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await updateSessionTitle(titleInput);
                    setIsEditingTitle(false);
                  }}
                  className="p-1 text-app-success"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTitleInput(currentSession.title);
                  setIsEditingTitle(true);
                }}
                className="font-bold text-sm text-app-text truncate hover:underline flex items-center gap-1.5"
              >
                <span className="truncate">{currentSession.title}</span>
                <Edit2 className="w-3 h-3 text-app-muted shrink-0" />
              </button>
            )}

            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-app-surface-2 text-[11px] font-medium text-app-muted border border-app-border">
              {t(`contexts.${currentSession.context}`)}
            </span>
          </div>
        </div>

        {/* Right: Timer, Spoken Language Switcher, Emergency, End */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Spoken language selector */}
          <div className="hidden sm:flex items-center gap-1 bg-app-surface-2 p-0.5 rounded-control text-xs font-semibold">
            {(['fr', 'ar', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setSpokenLang(l)}
                className={`px-2 py-0.5 rounded-control uppercase transition-all ${
                  currentSession.spokenLang === l
                    ? 'bg-app-surface text-app-primary-strong shadow-1 font-bold'
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Active Timer */}
          <div className="px-2 py-1 rounded-control bg-app-surface-2 text-xs font-mono font-bold text-app-text tabular-nums">
            {formatDuration(activeMs)}
          </div>

          {/* Emergency Trigger */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEmergencySheetOpen(true)}
            iconStart={<Siren className="w-4 h-4 text-app-warning" />}
            className="border-app-warning/50 hover:bg-amber-500/10 dark:hover:bg-amber-500/15"
          >
            <span className="hidden md:inline">{t('emergency.button', 'Urgence')}</span>
          </Button>

          {/* Pause / Resume */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (status === 'active' ? pauseSession() : resumeSession())}
          >
            {status === 'active' ? (
              <Pause className="w-4 h-4 text-app-muted" />
            ) : (
              <Play className="w-4 h-4 text-app-primary-strong" />
            )}
          </Button>

          {/* Conversation History Drawer (Desktop) */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setConversationDrawerOpen(true);
              setUnreadMessages(false);
            }}
            iconStart={<MessageSquare className="w-4 h-4 text-app-primary-strong" />}
            className="hidden md:inline-flex items-center gap-1.5"
            aria-label={t('timeline.title', 'Conversation')}
          >
            <span>{t('timeline.title', 'Conversation')}</span>
            <span className="px-1.5 py-0.5 rounded-pill bg-app-surface-2 text-[11px] font-mono font-bold text-app-muted">
              {messages.length}
            </span>
            {unreadMessages && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          </Button>

          {/* End session */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setEndConfirmOpen(true)}
          >
            {t('dash.end', 'Terminer')}
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Demo Coach callout if active */}
      {isDemoActive && (
        <div className="px-4">
          <DemoCoach spokenLang={currentSession.spokenLang} />
        </div>
      )}

      {/* Mobile Mode Segmented Tabs (< 768px) */}
      <div className="md:hidden px-4 pt-2 pb-1 bg-app-surface border-b border-app-border">
        <SegmentedControl
          value={mobileTab}
          onChange={(tab) => {
            setMobileTab(tab);
            if (tab === 'conversation') setUnreadMessages(false);
          }}
          size="sm"
          options={[
            { value: 'sign', label: '🤟 LSA' },
            { value: 'speech', label: '🗣️ Parole' },
            {
              value: 'conversation',
              label: (
                <span className="flex items-center gap-1">
                  <span>Discussion</span>
                  {unreadMessages && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </span>
              ),
            },
          ]}
          className="w-full"
        />
      </div>

      {/* Main Workspace Area (Desktop Grid vs Mobile View) */}
      <div className="flex-1 min-h-0 overflow-hidden p-2 sm:p-3 lg:p-4 w-full max-w-[1720px] mx-auto flex flex-col">
        {/* Primary Interaction Panels (Sign on Start, Language on End) */}
        <div className={`grid grid-cols-1 ${colRatio} gap-3 sm:gap-4 flex-1 min-h-0 h-full`}>
          {/* LEFT PANEL: LSA (Sign side) */}
          <Card
            p={16}
            className={`flex flex-col justify-between min-h-0 overflow-y-auto ${
              mobileTab !== 'sign' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-app-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    🤟
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-app-text">
                      {t('mode.signToLang', 'Sign to Text (Algerian Sign Language)')}
                    </h3>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                      AI Model in Active Development · Research Prototype
                    </span>
                  </div>
                </div>
                <RecognitionStatus
                  state={
                    camera.status === 'idle'
                      ? 'permission_needed'
                      : camera.status === 'error'
                      ? 'error'
                      : recognition.state
                  }
                  errorMessage={
                    camera.status === 'error'
                      ? camera.errorCode === 'CAM-001'
                        ? t('err.camBlocked', 'Camera access blocked. Please enable camera permissions.')
                        : t('err.camGeneric', 'Camera hardware error.')
                      : recognition.errorMessage
                  }
                />
              </div>

              {/* Camera Panel */}
              <CameraPanel
                videoRef={camera.videoRef}
                cameraStatus={camera.status}
                errorCode={camera.errorCode}
                onStartCamera={camera.startCamera}
                mirror={settings.camera.mirror}
                onToggleMirror={() =>
                  updateSettings({
                    camera: { ...settings.camera, mirror: !settings.camera.mirror },
                  })
                }
                showTracking={settings.camera.showTrackingByDefault}
                onToggleTracking={() =>
                  updateSettings({
                    camera: {
                      ...settings.camera,
                      showTrackingByDefault: !settings.camera.showTrackingByDefault,
                    },
                  })
                }
                isRecognizing={
                  recognition.state === 'recognizing' || recognition.state === 'capturing'
                }
              />

              {/* Detected signs row */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                  {t('rec.detectedSigns', 'Signes détectés')}
                </span>
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-app-surface-2 rounded-control border border-app-border">
                  {recognition.recognizedResult?.signs &&
                  recognition.recognizedResult.signs.length > 0 ? (
                    recognition.recognizedResult.signs.map((sign, idx) => (
                      <DetectedSignChip
                        key={idx}
                        gloss={sign.gloss}
                        confidence={sign.confidence}
                        level={sign.level}
                        atMs={sign.atMs}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-app-muted italic">
                      {t('rec.detectedSignsEmpty', 'Les signes détectés apparaîtront ici')}
                    </span>
                  )}
                </div>
              </div>

              {/* Proposed Message Card */}
              {recognition.state === 'recognized' && recognition.proposedSentence && (
                <SentenceCard
                  sentence={recognition.proposedSentence}
                  confidence={recognition.recognizedResult?.overallConfidence}
                  level={recognition.recognizedResult?.level}
                  spokenLang={currentSession.spokenLang}
                  onSend={handleSendProposed}
                  onDiscard={recognition.resetToReady}
                />
              )}
            </div>

            {/* Left Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-app-border mt-2.5">
              <div className="flex items-center gap-2">
                {recognition.state === 'recognizing' || recognition.state === 'capturing' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={recognition.stopRecognition}
                    iconStart={<StopCircle className="w-3.5 h-3.5" />}
                  >
                    {t('rec.stopRec', 'Arrêter')}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      if (camera.status !== 'ready') {
                        await camera.startCamera();
                      }
                      recognition.startRecognition();
                    }}
                    iconStart={<Radio className="w-3.5 h-3.5 animate-pulse" />}
                  >
                    {t('rec.startRec', 'Démarrer la reconnaissance')}
                  </Button>
                )}

                {/* Simulate sign button in Demo mode */}
                {isDemoActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSimulateSign}
                    iconStart={<Sparkles className="w-3.5 h-3.5 text-app-warning" />}
                  >
                    {t('rec.simulateSign', 'Simuler le signe')}
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhrasePickerOpen(true)}
                iconStart={<BookOpen className="w-3.5 h-3.5" />}
              >
                {t('rec.usePhrases', 'Phrases rapides')}
              </Button>
            </div>
          </Card>

          {/* RIGHT PANEL: Language (Spoken / Hearing side) */}
          <Card
            p={16}
            className={`flex flex-col justify-between min-h-0 overflow-y-auto ${
              mobileTab !== 'speech' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-app-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    🗣️
                  </span>
                  <h3 className="font-bold text-sm text-app-text">
                    {t('mode.langToSign', 'Langue parlée / Écrite')}
                  </h3>
                </div>

                <SegmentedControl
                  value={composerMode}
                  onChange={setComposerMode}
                  size="sm"
                  options={[
                    { value: 'type', label: t('composer.typeTab', 'Écrire') },
                    { value: 'speak', label: t('composer.speakTab', 'Parler') },
                  ]}
                />
              </div>

              {/* Composer input (Type or Speak) */}
              {composerMode === 'type' ? (
                <div className="space-y-2">
                  <textarea
                    ref={composerTextareaRef}
                    rows={2}
                    dir="auto"
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTranslateToLsa();
                      }
                    }}
                    placeholder={t('composer.placeholder', 'Tapez votre message… (Entrée pour traduire)')}
                    className="w-full p-3 rounded-control border border-app-border-strong bg-app-surface text-app-text text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary-strong"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!composerText.trim()}
                      onClick={() => handleTranslateToLsa()}
                      iconEnd={<Send className="w-3.5 h-3.5" />}
                    >
                      {t('composer.translateAction', 'Traduire en LSA')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-app-surface-2 rounded-control border border-app-border space-y-2.5 text-center">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    aria-label={sttListening ? 'Arrêter l’écoute' : 'Appuyer pour parler'}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      sttListening
                        ? 'bg-app-error text-white animate-pulse shadow-lg scale-105'
                        : 'bg-app-primary-strong text-white hover:bg-app-primary-hover shadow-1'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>

                  <div>
                    <p className="text-xs sm:text-sm font-bold text-app-text">
                      {sttListening
                        ? t('composer.listening', 'Écoute en cours…')
                        : t('composer.tapToSpeak', 'Appuyer pour parler')}
                    </p>
                    {composerText && (
                      <p className="text-xs text-app-muted italic mt-1 max-w-sm">
                        "{composerText}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick suggestions chips */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                  {t('composer.quickSuggestions', 'Suggestions rapides')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {composerSuggestions.map((sug) => {
                    const text = sug.text[currentSession.spokenLang] || sug.text.fr;
                    return (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => {
                          setComposerText(text);
                          handleTranslateToLsa(text);
                        }}
                        className="px-2 py-1 rounded-control bg-app-surface-2 border border-app-border hover:bg-app-border text-xs text-app-text transition-colors text-start"
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sign Player for translated LSA clips */}
              {translatedClips.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-app-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-app-primary-strong">
                    {t('composer.lsaSequence', 'Séquence LSA')}
                  </span>
                  <SignPlayer clips={translatedClips} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Mobile-Only Conversation Timeline Tab */}
        <Card
          p={16}
          className={`md:hidden flex-1 min-h-0 flex flex-col overflow-hidden ${
            mobileTab !== 'conversation' ? 'hidden' : 'flex'
          }`}
        >
          {/* Timeline Header */}
          <div className="flex items-center justify-between border-b border-app-border pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-app-text">
                {t('timeline.title', 'Conversation')}
              </h3>
              <span className="px-2 py-0.5 rounded-pill bg-app-surface-2 text-xs font-mono font-bold text-app-muted">
                {messages.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport('txt')}
                iconStart={<Download className="w-3.5 h-3.5" />}
              >
                Exporter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setClearConfirmOpen(true)}
                iconStart={<Trash2 className="w-3.5 h-3.5 text-app-muted" />}
              >
                Effacer
              </Button>
            </div>
          </div>

          {/* Timeline Log Region */}
          <div
            ref={timelineRef}
            role="log"
            aria-live="polite"
            onScroll={handleTimelineScroll}
            className="flex-1 overflow-y-auto py-4 px-1 space-y-2 relative"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-app-muted space-y-2">
                <p className="text-sm">{t('timeline.empty', 'Votre conversation apparaîtra ici.')}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 bg-app-surface-2 rounded-control">
                    🤟 Signez à la caméra
                  </span>
                  <span className="px-2.5 py-1 bg-app-surface-2 rounded-control">
                    🗣️ Écrivez ou parlez
                  </span>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onReplaySigns={async (gloss) => {
                    const clips = await registry.signAssets.getClips(gloss);
                    setTranslatedClips(clips);
                    if (window.innerWidth < 768) {
                      setMobileTab('speech');
                    }
                  }}
                  onEditMessage={editMessage}
                />
              ))
            )}

            {/* Scroll to bottom floating chip */}
            {showScrollBottom && (
              <button
                type="button"
                onClick={scrollToBottom}
                className="sticky bottom-2 start-1/2 -translate-x-1/2 px-3 py-1.5 rounded-pill bg-app-primary-strong text-white text-xs font-semibold shadow-2 flex items-center gap-1.5 hover:bg-app-primary-hover animate-slide-up"
              >
                <span>{t('timeline.newMessage', 'Nouveau message ↓')}</span>
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Desktop Conversation History Drawer Sheet */}
      <Sheet
        isOpen={conversationDrawerOpen}
        onClose={() => setConversationDrawerOpen(false)}
        title={`${t('timeline.title', 'Conversation')} (${messages.length})`}
        maxWidth="lg"
      >
        <div className="flex flex-col h-[75vh]">
          {/* Timeline Action Header */}
          <div className="flex items-center justify-end gap-2 pb-3 border-b border-app-border shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExport('txt')}
              iconStart={<Download className="w-3.5 h-3.5" />}
            >
              Exporter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClearConfirmOpen(true)}
              iconStart={<Trash2 className="w-3.5 h-3.5 text-app-muted" />}
            >
              Effacer
            </Button>
          </div>

          {/* Timeline Messages List */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto py-4 px-1 space-y-2 relative"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-app-muted space-y-2">
                <p className="text-sm">{t('timeline.empty', 'Votre conversation apparaîtra ici.')}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 bg-app-surface-2 rounded-control">
                    🤟 Signez à la caméra
                  </span>
                  <span className="px-2.5 py-1 bg-app-surface-2 rounded-control">
                    🗣️ Écrivez ou parlez
                  </span>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onReplaySigns={async (gloss) => {
                    const clips = await registry.signAssets.getClips(gloss);
                    setTranslatedClips(clips);
                    setConversationDrawerOpen(false);
                  }}
                  onEditMessage={editMessage}
                />
              ))
            )}
          </div>
        </div>
      </Sheet>

      {/* Phrasebook Picker Sheet */}
      <Sheet
        isOpen={phrasePickerOpen}
        onClose={() => setPhrasePickerOpen(false)}
        title="Sélectionner une phrase rapide"
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {composerSuggestions.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              onSendToConversation={(p) => {
                setComposerText(p.text[currentSession.spokenLang] || p.text.fr);
                handleTranslateToLsa(p.text[currentSession.spokenLang] || p.text.fr);
                setPhrasePickerOpen(false);
              }}
            />
          ))}
        </div>
      </Sheet>

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={endConfirmOpen}
        onClose={() => setEndConfirmOpen(false)}
        title="Terminer la conversation ?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEndConfirmOpen(false)}>
              Continuer
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setEndConfirmOpen(false);
                camera.stopCamera();
                await endSession();
                addToast({ message: 'Conversation terminée et enregistrée', type: 'status' });
                navigate(`/app/history/${sessionId}`);
              }}
            >
              Terminer la session
            </Button>
          </>
        }
      >
        <p className="text-sm text-app-muted leading-relaxed">
          La session sera clôturée et sauvegardée dans votre Historique local. Vous pourrez la relire
          et l’exporter à tout moment.
        </p>
      </Modal>

      {/* Clear Messages Confirmation Modal */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => !isClearingMessages && setClearConfirmOpen(false)}
        title={t('timeline.clearConfirmTitle', 'Effacer les messages ?')}
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isClearingMessages}
              onClick={() => setClearConfirmOpen(false)}
            >
              {t('common.cancel', 'Annuler')}
            </Button>
            <Button
              variant="destructive"
              disabled={isClearingMessages}
              onClick={async () => {
                setIsClearingMessages(true);
                try {
                  const success = await clearSessionMessages();
                  if (success) {
                    setClearConfirmOpen(false);
                    addToast({
                      message: t('timeline.messagesCleared', 'Messages effacés avec succès'),
                      type: 'status',
                    });
                  } else {
                    addToast({
                      message: t('timeline.clearFailed', 'Échec de la suppression des messages'),
                      type: 'alert',
                    });
                  }
                } catch {
                  addToast({
                    message: t('timeline.clearFailed', 'Échec de la suppression des messages'),
                    type: 'alert',
                  });
                } finally {
                  setIsClearingMessages(false);
                }
              }}
            >
              {isClearingMessages ? t('common.loading', 'Effacement…') : t('timeline.clearAction', 'Effacer')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-app-muted">
          {t('timeline.clearConfirmDesc', 'Tous les messages de la conversation active seront effacés.')}
        </p>
      </Modal>
    </div>
  );
};
