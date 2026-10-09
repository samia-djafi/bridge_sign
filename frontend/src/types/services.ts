import {
  AiMode,
  ConversationMessage,
  ConversationSession,
  LandmarkFrame,
  ModelMetrics,
  Phrase,
  RecognitionResult,
  SignClip,
  SpokenLang,
  TextToSignResult,
  Translation,
} from './domain';

export interface ServiceError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface SignRecognitionService {
  start(opts: { lang: SpokenLang }): Promise<void>;
  push(frame: LandmarkFrame): void;
  finalize(): Promise<RecognitionResult>;
  reset(): void;
  readonly adapter: AiMode;
}

export interface LanguageGenerationService {
  glossToSentence(gloss: string[], targets?: SpokenLang[]): Promise<Translation>;
}

export interface TextToSignService {
  sentenceToGloss(text: string, lang: SpokenLang): Promise<TextToSignResult>;
}

export interface SignAssetService {
  getClips(gloss: string[]): Promise<SignClip[]>;
  preload(gloss: string[]): void;
}

export interface Voice {
  id: string;
  name: string;
  lang: string;
  isDefault?: boolean;
}

export interface SpeechService {
  stt: {
    isSupported: () => boolean;
    start(opts: {
      lang: SpokenLang;
      onInterim: (text: string) => void;
      onFinal: (text: string) => void;
      onError: (err: string) => void;
    }): void;
    stop(): void;
  };
  tts: {
    isSupported: () => boolean;
    speak(opts: {
      text: string;
      lang: SpokenLang;
      rate?: number;
      volume?: number;
      voiceId?: string;
    }): Promise<void>;
    stop(): void;
  };
  voicesFor(lang: SpokenLang): Voice[];
}

export interface SessionRepository {
  create(session: Omit<ConversationSession, 'id' | 'startedAt' | 'messageCount' | 'activeMs'>): Promise<ConversationSession>;
  get(id: string): Promise<ConversationSession | undefined>;
  list(): Promise<ConversationSession[]>;
  update(id: string, changes: Partial<ConversationSession>): Promise<void>;
  remove(id: string): Promise<void>;
  softDelete(id: string): Promise<() => Promise<void>>; // returns undo function
  appendMessage(message: Omit<ConversationMessage, 'id' | 'createdAt'>): Promise<ConversationMessage>;
  listMessages(sessionId: string): Promise<ConversationMessage[]>;
  updateMessage(id: string, changes: Partial<ConversationMessage>): Promise<void>;
  clearAll(): Promise<void>;
  exportSession(id: string): Promise<{ session: ConversationSession; messages: ConversationMessage[] }>;
}

export interface PhrasebookService {
  list(): Promise<Phrase[]>;
  search(query: string, filters?: { category?: string; context?: string }): Promise<Phrase[]>;
  toggleFavorite(phraseId: string): Promise<boolean>;
  isFavorite(phraseId: string): Promise<boolean>;
  getFavorites(): Promise<string[]>;
}

export interface MetricsService {
  getMetrics(): ModelMetrics;
  subscribe(callback: (metrics: ModelMetrics) => void): () => void;
  updateMetrics(partial: Partial<ModelMetrics>): void;
}
