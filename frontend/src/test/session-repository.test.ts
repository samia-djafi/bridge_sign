import { describe, it, expect, beforeEach } from 'vitest';
import { sessionRepository } from '@/services/session-repository';

describe('session-repository', () => {
  beforeEach(async () => {
    await sessionRepository.clearAll();
  });

  it('creates and retrieves a conversation session', async () => {
    const session = await sessionRepository.create({
      title: 'Pharmacie Test',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    expect(session.id).toBeDefined();
    expect(session.title).toBe('Pharmacie Test');

    const fetched = await sessionRepository.get(session.id);
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe('Pharmacie Test');
  });

  it('appends messages and updates session messageCount', async () => {
    const session = await sessionRepository.create({
      title: 'Session Test',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    const msg = await sessionRepository.appendMessage({
      sessionId: session.id,
      direction: 'sign_to_language',
      source: 'lsa',
      originalInput: ['HEADACHE'],
      outputs: {
        fr: "J'ai mal à la tête.",
        ar: 'عندي صداع في الرأس.',
        en: 'I have a headache.',
      },
      gloss: ['HEADACHE'],
      displayLang: 'fr',
      confidence: 0.95,
      level: 'high',
      edited: false,
    });

    expect(msg.id).toBeDefined();

    const messages = await sessionRepository.listMessages(session.id);
    expect(messages.length).toBe(1);
    expect(messages[0]?.outputs.fr).toBe("J'ai mal à la tête.");

    const updatedSession = await sessionRepository.get(session.id);
    expect(updatedSession?.messageCount).toBe(1);
  });

  it('supports soft-delete and undo', async () => {
    const session = await sessionRepository.create({
      title: 'Session à supprimer',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    const undo = await sessionRepository.softDelete(session.id);

    // Verify it is deleted from active listing
    const beforeUndo = await sessionRepository.get(session.id);
    expect(beforeUndo).toBeUndefined();

    // Call undo
    await undo();

    // Verify it is restored
    const afterUndo = await sessionRepository.get(session.id);
    expect(afterUndo).toBeDefined();
    expect(afterUndo?.title).toBe('Session à supprimer');
  });

  it('exports session and messages data', async () => {
    const session = await sessionRepository.create({
      title: 'Export Test',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    await sessionRepository.appendMessage({
      sessionId: session.id,
      direction: 'language_to_sign',
      source: 'fr',
      originalInput: 'Prenez ce médicament.',
      outputs: {
        fr: 'Prenez ce médicament.',
        ar: 'تناول هذا الدواء.',
        en: 'Take this medicine.',
      },
      gloss: ['THIS', 'MEDICINE', 'TAKE'],
      displayLang: 'fr',
      confidence: 1.0,
      level: 'high',
      edited: false,
    });

    const exported = await sessionRepository.exportSession(session.id);
    expect(exported.session.id).toBe(session.id);
    expect(exported.messages.length).toBe(1);
  });
});
