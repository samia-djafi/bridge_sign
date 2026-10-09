export type UiLang = 'fr' | 'ar' | 'en';
export type SpokenLang = UiLang;
export type ContextId = 'healthcare' | 'administration' | 'education' | 'everyday' | 'other';
export type Direction = 'sign_to_language' | 'language_to_sign';
export type MessageSource = 'lsa' | SpokenLang;
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type AiMode = 'demo' | 'live';
export type SessionStatus = 'active' | 'paused' | 'ended';
export type SessionMode = 'two_way' | 'sign_to_language' | 'language_to_sign';

export interface Sign {
  id: string;
  gloss: string;
  labels: Record<UiLang, string>;
  clipId?: string;
  category: string;
}

export interface DetectedSign {
  gloss: string;
  confidence: number;
  level: ConfidenceLevel;
  atMs: number;
}

export interface SignSequence {
  glosses: string[];
}

export interface Translation {
  fr: string;
  ar: string;
  en: string;
}

export interface RecognitionResult {
  signs: DetectedSign[];
  sequence: string[];
  overallConfidence: number;
  level: ConfidenceLevel;
  frames: number;
  latencyMs: number;
  model: { name: string; version: string };
  adapter: AiMode;
}

export interface TextToSignResult {
  gloss: string[];
  unsupportedTokens: string[];
  matchedPhraseId?: string;
  suggestions: string[]; // phrase ids when no match
}

export interface SignClip {
  gloss: string;
  src: string;
  durationMs: number;
  poster?: string;
  isPlaceholder: boolean;
}

export interface Interpretation {
  recognizedSigns: DetectedSign[];
  frames: number;
  latencyMs: number;
  model: string;
  adapter: AiMode;
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  direction: Direction;
  source: MessageSource;
  originalInput: string | string[]; // text, or gloss list
  outputs: Translation;
  gloss: string[];
  displayLang: SpokenLang; // language currently shown
  confidence: number | null;
  level: ConfidenceLevel | null;
  edited: boolean;
  interpretation?: Interpretation;
  createdAt: number; // epoch ms
}

export interface ConversationSession {
  id: string;
  title: string;
  context: ContextId;
  signLanguage: 'LSA';
  spokenLang: SpokenLang;
  mode: SessionMode;
  status: SessionStatus;
  aiMode: AiMode;
  privacy: 'local';
  startedAt: number;
  endedAt?: number;
  pausedAt?: number;
  messageCount: number;
  activeMs: number;
}

export interface Phrase {
  id: string;
  category: 'symptoms' | 'medication' | 'appointment' | 'emergency' | 'everyday';
  text: Translation;
  gloss: string[];
  contexts: ContextId[];
  emergency?: boolean;
}

export interface ModelMetrics {
  fps: number;
  inferenceMs: number | null;
  vocabSize: number;
  tracking: 'stable' | 'unstable' | 'lost';
  adapter: AiMode;
  model: string;
  version: string;
}

export interface Settings {
  version: 1;
  onboarded: boolean;
  role: 'sign' | 'speech' | 'helper';
  uiLang: UiLang;
  defaultSpokenLang: SpokenLang;
  lastContext: ContextId;
  lastMode: SessionMode;
  theme: 'system' | 'light' | 'dark' | 'hc';
  textScale: 100 | 125 | 150;
  reducedMotion: 'system' | 'on' | 'off';
  captions: boolean;
  showGloss: boolean;
  largeTargets: boolean;
  haptics: boolean;
  announce: 'full' | 'minimal';
  camera: {
    deviceId?: string;
    mirror: boolean;
    resolution: 'auto' | 'low' | 'high';
    showTrackingByDefault: boolean;
  };
  audio: {
    voiceOutput: boolean;
    rate: number;
    volume: number;
    voices: Partial<Record<SpokenLang, string>>;
  };
  ai: {
    adapter: 'mock' | 'http';
    apiBaseUrl: string;
    threshold: number;
  };
  privacy: {
    retention: 'forever' | '30d' | '7d';
    autoLogMessages: boolean;
  };
  limitationsAckAt?: number;
  installDismissedAt?: number;
  lastSeenVersion?: string;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface LandmarkFrame {
  t: number;
  hands: NormalizedLandmark[][]; // up to 2 hands, 21 points each
  pose?: NormalizedLandmark[];
}
