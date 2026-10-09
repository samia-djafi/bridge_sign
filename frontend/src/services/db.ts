import Dexie, { type EntityTable } from 'dexie';
import { ConversationMessage, ConversationSession } from '@/types/domain';

export interface FavoriteRecord {
  phraseId: string;
  createdAt: number;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

export class LsaDatabase extends Dexie {
  sessions!: EntityTable<ConversationSession, 'id'>;
  messages!: EntityTable<ConversationMessage, 'id'>;
  favorites!: EntityTable<FavoriteRecord, 'phraseId'>;
  meta!: EntityTable<MetaRecord, 'key'>;

  constructor() {
    super('lsa-bridge');
    this.version(1).stores({
      sessions: 'id, status, startedAt, context',
      messages: 'id, sessionId, createdAt',
      favorites: 'phraseId',
      meta: 'key',
    });
  }
}

export const db = new LsaDatabase();
