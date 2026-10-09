import { create } from 'zustand';
import { ConversationMessage, ConversationSession, SessionStatus, SpokenLang } from '@/types/domain';
import { registry } from '@/services/registry';

interface SessionState {
  currentSession: ConversationSession | null;
  messages: ConversationMessage[];
  status: SessionStatus;
  activeMs: number;
  isLoading: boolean;

  loadSession: (sessionId: string) => Promise<boolean>;
  startSession: (data: Omit<ConversationSession, 'id' | 'startedAt' | 'messageCount' | 'activeMs' | 'status' | 'aiMode' | 'privacy'>) => Promise<string>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  endSession: () => Promise<void>;
  addMessage: (msg: Omit<ConversationMessage, 'id' | 'createdAt' | 'sessionId'>) => Promise<ConversationMessage | null>;
  editMessage: (messageId: string, newOutputs: ConversationMessage['outputs']) => Promise<void>;
  setSpokenLang: (lang: SpokenLang) => Promise<void>;
  updateSessionTitle: (title: string) => Promise<void>;
  incrementActiveTime: (deltaMs: number) => void;
}

let timerInterval: any = null;

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  messages: [],
  status: 'ended',
  activeMs: 0,
  isLoading: false,

  loadSession: async (sessionId: string): Promise<boolean> => {
    set({ isLoading: true });
    try {
      const session = await registry.sessions.get(sessionId);
      if (!session) {
        set({ currentSession: null, messages: [], status: 'ended', isLoading: false });
        return false;
      }

      const msgs = await registry.sessions.listMessages(sessionId);

      // Clean up previous timer
      if (timerInterval) clearInterval(timerInterval);

      set({
        currentSession: session,
        messages: msgs,
        status: session.status,
        activeMs: session.activeMs || 0,
        isLoading: false,
      });

      if (session.status === 'active') {
        timerInterval = setInterval(() => {
          get().incrementActiveTime(1000);
        }, 1000);
      }

      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  startSession: async (data): Promise<string> => {
    if (timerInterval) clearInterval(timerInterval);

    const session = await registry.sessions.create({
      ...data,
      status: 'active',
      aiMode: registry.ai.adapter,
      privacy: 'local',
    });

    set({
      currentSession: session,
      messages: [],
      status: 'active',
      activeMs: 0,
    });

    timerInterval = setInterval(() => {
      get().incrementActiveTime(1000);
    }, 1000);

    return session.id;
  },

  pauseSession: async () => {
    const { currentSession, activeMs } = get();
    if (!currentSession || currentSession.status === 'paused') return;

    if (timerInterval) clearInterval(timerInterval);

    await registry.sessions.update(currentSession.id, {
      status: 'paused',
      pausedAt: Date.now(),
      activeMs,
    });

    set({
      status: 'paused',
      currentSession: { ...currentSession, status: 'paused', activeMs },
    });
  },

  resumeSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    await registry.sessions.update(currentSession.id, {
      status: 'active',
      pausedAt: undefined,
    });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      get().incrementActiveTime(1000);
    }, 1000);

    set({
      status: 'active',
      currentSession: { ...currentSession, status: 'active' },
    });
  },

  endSession: async () => {
    const { currentSession, activeMs } = get();
    if (!currentSession) return;

    if (timerInterval) clearInterval(timerInterval);

    await registry.sessions.update(currentSession.id, {
      status: 'ended',
      endedAt: Date.now(),
      activeMs,
    });

    set({
      status: 'ended',
      currentSession: { ...currentSession, status: 'ended', activeMs },
    });
  },

  addMessage: async (msgData) => {
    const { currentSession } = get();
    if (!currentSession) return null;

    const saved = await registry.sessions.appendMessage({
      ...msgData,
      sessionId: currentSession.id,
    });

    set((state) => ({
      messages: [...state.messages, saved],
      currentSession: state.currentSession
        ? { ...state.currentSession, messageCount: (state.currentSession.messageCount || 0) + 1 }
        : null,
    }));

    return saved;
  },

  editMessage: async (messageId: string, newOutputs) => {
    await registry.sessions.updateMessage(messageId, {
      outputs: newOutputs,
      edited: true,
    });

    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, outputs: newOutputs, edited: true } : m
      ),
    }));
  },

  setSpokenLang: async (lang: SpokenLang) => {
    const { currentSession } = get();
    if (!currentSession) return;

    await registry.sessions.update(currentSession.id, { spokenLang: lang });
    set({
      currentSession: { ...currentSession, spokenLang: lang },
    });
  },

  updateSessionTitle: async (title: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    await registry.sessions.update(currentSession.id, { title });
    set({
      currentSession: { ...currentSession, title },
    });
  },

  incrementActiveTime: (deltaMs: number) => {
    set((state) => {
      const nextMs = state.activeMs + deltaMs;
      // Sync every 15s to DB
      if (Math.floor(nextMs / 15000) > Math.floor(state.activeMs / 15000) && state.currentSession) {
        registry.sessions.update(state.currentSession.id, { activeMs: nextMs });
      }
      return { activeMs: nextMs };
    });
  },
}));
