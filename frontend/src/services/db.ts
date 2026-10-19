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

export class ConnectSignDatabase extends Dexie {
  sessions!: EntityTable<ConversationSession, 'id'>;
  messages!: EntityTable<ConversationMessage, 'id'>;
  favorites!: EntityTable<FavoriteRecord, 'phraseId'>;
  meta!: EntityTable<MetaRecord, 'key'>;

  constructor() {
    super('connectsign');
    this.version(1).stores({
      sessions: 'id, status, startedAt, context',
      messages: 'id, sessionId, createdAt',
      favorites: 'phraseId',
      meta: 'key',
    });
  }
}

export { ConnectSignDatabase as LsaDatabase };
export const db = new ConnectSignDatabase();

// Backward compatibility: safely and idempotently migrate records from legacy 'lsa-bridge' database if present
if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
  const DB_MIGRATION_FLAG = 'connectsign-db-migrated-v1';
  try {
    if (!localStorage.getItem(DB_MIGRATION_FLAG)) {
      Dexie.exists('lsa-bridge')
        .then(async (exists) => {
          if (exists) {
            try {
              const legacyDb = new Dexie('lsa-bridge');
              legacyDb.version(1).stores({
                sessions: 'id, status, startedAt, context',
                messages: 'id, sessionId, createdAt',
                favorites: 'phraseId',
                meta: 'key',
              });
              await legacyDb.open();
              const [sessions, messages, favorites, meta] = await Promise.all([
                legacyDb.table<ConversationSession, 'id'>('sessions').toArray(),
                legacyDb.table<ConversationMessage, 'id'>('messages').toArray(),
                legacyDb.table<FavoriteRecord, 'phraseId'>('favorites').toArray(),
                legacyDb.table<MetaRecord, 'key'>('meta').toArray(),
              ]);
              if (sessions.length > 0) await db.sessions.bulkPut(sessions);
              if (messages.length > 0) await db.messages.bulkPut(messages);
              if (favorites.length > 0) await db.favorites.bulkPut(favorites);
              if (meta.length > 0) await db.meta.bulkPut(meta);
              legacyDb.close();
            } catch (err) {
              console.warn('ConnectSign: Non-critical issue during legacy DB migration:', err);
            }
          }
          try {
            localStorage.setItem(DB_MIGRATION_FLAG, '1');
          } catch {}
        })
        .catch(() => {});
    }
  } catch {}
}
