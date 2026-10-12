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

  it('clears messages for the active session without touching other sessions or deleting the session', async () => {
    // Create Session 1
    const session1 = await sessionRepository.create({
      title: 'Session 1',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    // Create Session 2
    const session2 = await sessionRepository.create({
      title: 'Session 2',
      context: 'administration',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    // Add messages to Session 1
    await sessionRepository.appendMessage({
      sessionId: session1.id,
      direction: 'sign_to_language',
      source: 'lsa',
      originalInput: ['HELLO'],
      outputs: { fr: 'Bonjour', ar: 'مرحبا', en: 'Hello' },
      gloss: ['HELLO'],
      displayLang: 'fr',
      confidence: 0.99,
      level: 'high',
      edited: false,
    });

    // Add messages to Session 2
    await sessionRepository.appendMessage({
      sessionId: session2.id,
      direction: 'sign_to_language',
      source: 'lsa',
      originalInput: ['THANK_YOU'],
      outputs: { fr: 'Merci', ar: 'شكرا', en: 'Thank you' },
      gloss: ['THANK_YOU'],
      displayLang: 'fr',
      confidence: 0.95,
      level: 'high',
      edited: false,
    });

    expect((await sessionRepository.listMessages(session1.id)).length).toBe(1);
    expect((await sessionRepository.listMessages(session2.id)).length).toBe(1);

    // Clear session 1 messages
    await sessionRepository.clearSessionMessages(session1.id);

    // Session 1 messages should be 0, session still exists, messageCount is 0
    const s1Messages = await sessionRepository.listMessages(session1.id);
    expect(s1Messages.length).toBe(0);
    const s1Fetched = await sessionRepository.get(session1.id);
    expect(s1Fetched).toBeDefined();
    expect(s1Fetched?.messageCount).toBe(0);

    // Session 2 messages should still exist and remain untouched
    const s2Messages = await sessionRepository.listMessages(session2.id);
    expect(s2Messages.length).toBe(1);
    const s2Fetched = await sessionRepository.get(session2.id);
    expect(s2Fetched).toBeDefined();
    expect(s2Fetched?.messageCount).toBe(1);
  });
});
