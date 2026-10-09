import { db } from './db';
import { ConversationMessage, ConversationSession } from '@/types/domain';
import { SessionRepository } from '@/types/services';
import { generateId } from '@/lib/ids';

class DexieSessionRepository implements SessionRepository {
  private softDeletedSessions = new Map<string, { session: ConversationSession; messages: ConversationMessage[]; timeout: ReturnType<typeof setTimeout> }>();

  async create(sessionData: Omit<ConversationSession, 'id' | 'startedAt' | 'messageCount' | 'activeMs'>): Promise<ConversationSession> {
    const session: ConversationSession = {
      ...sessionData,
      id: generateId('sess'),
      startedAt: Date.now(),
      messageCount: 0,
      activeMs: 0,
    };
    await db.sessions.add(session);
    return session;
  }

  async get(id: string): Promise<ConversationSession | undefined> {
    return await db.sessions.get(id);
  }

  async list(): Promise<ConversationSession[]> {
    return await db.sessions.orderBy('startedAt').reverse().toArray();
  }

  async update(id: string, changes: Partial<ConversationSession>): Promise<void> {
    await db.sessions.update(id, changes);
  }

  async remove(id: string): Promise<void> {
    await db.transaction('rw', db.sessions, db.messages, async () => {
      await db.messages.where('sessionId').equals(id).delete();
      await db.sessions.delete(id);
    });
  }

  async softDelete(id: string): Promise<() => Promise<void>> {
    const session = await db.sessions.get(id);
    if (!session) {
      return async () => {};
    }
    const messages = await db.messages.where('sessionId').equals(id).toArray();

    // Temporarily delete from DB
    await db.transaction('rw', db.sessions, db.messages, async () => {
      await db.messages.where('sessionId').equals(id).delete();
      await db.sessions.delete(id);
    });

    const timeout = setTimeout(() => {
      this.softDeletedSessions.delete(id);
    }, 5000);

    this.softDeletedSessions.set(id, { session, messages, timeout });

    // Return undo callback
    return async () => {
      const stored = this.softDeletedSessions.get(id);
      if (stored) {
        clearTimeout(stored.timeout);
        this.softDeletedSessions.delete(id);
        await db.transaction('rw', db.sessions, db.messages, async () => {
          await db.sessions.add(stored.session);
          await db.messages.bulkAdd(stored.messages);
        });
      }
    };
  }

  async appendMessage(messageData: Omit<ConversationMessage, 'id' | 'createdAt'>): Promise<ConversationMessage> {
    const message: ConversationMessage = {
      ...messageData,
      id: generateId('msg'),
      createdAt: Date.now(),
    };

    await db.transaction('rw', db.sessions, db.messages, async () => {
      await db.messages.add(message);
      const session = await db.sessions.get(messageData.sessionId);
      if (session) {
        await db.sessions.update(messageData.sessionId, {
          messageCount: (session.messageCount || 0) + 1,
        });
      }
    });

    return message;
  }

  async listMessages(sessionId: string): Promise<ConversationMessage[]> {
    return await db.messages.where('sessionId').equals(sessionId).sortBy('createdAt');
  }

  async updateMessage(id: string, changes: Partial<ConversationMessage>): Promise<void> {
    await db.messages.update(id, changes);
  }

  async clearAll(): Promise<void> {
    await db.transaction('rw', db.sessions, db.messages, db.favorites, async () => {
      await db.messages.clear();
      await db.sessions.clear();
      await db.favorites.clear();
    });
  }

  async exportSession(id: string): Promise<{ session: ConversationSession; messages: ConversationMessage[] }> {
    const session = await this.get(id);
    if (!session) {
      throw new Error(`Session ${id} not found`);
    }
    const messages = await this.listMessages(id);
    return { session, messages };
  }
}

export const sessionRepository = new DexieSessionRepository();
