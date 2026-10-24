import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { WorkspacePage } from '@/features/workspace/WorkspacePage';
import { NewConversationPage } from '@/features/new-conversation/NewConversationPage';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { sessionRepository } from '@/services/session-repository';
import '@/i18n';

describe('Conversation Mode Selection & Conditional Interface Rendering', () => {
  beforeEach(async () => {
    await sessionRepository.clearAll();
    useSettingsStore.setState({
      settings: {
        ...useSettingsStore.getState().settings,
        defaultSpokenLang: 'fr',
        lastMode: 'two_way',
      },
    });
  });

  it('renders both Sign and Text interfaces when mode is two_way', async () => {
    const session = await sessionRepository.create({
      title: 'Double Sens Session',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    render(
      <MemoryRouter initialEntries={[`/app/workspace/${session.id}`]}>
        <Routes>
          <Route path="/app/workspace/:sessionId" element={<WorkspacePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('two-way-view')).toBeInTheDocument();
    });

    // Both interfaces are present
    expect(screen.getByTestId('sign-recognition-panel')).toBeInTheDocument();
    expect(screen.getByTestId('text-to-sign-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-to-language-view')).toBeNull();
    expect(screen.queryByTestId('language-to-sign-view')).toBeNull();
  });

  it('renders ONLY Sign to Text interface when mode is sign_to_language', async () => {
    const session = await sessionRepository.create({
      title: 'Sign Only Session',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'sign_to_language',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    render(
      <MemoryRouter initialEntries={[`/app/workspace/${session.id}`]}>
        <Routes>
          <Route path="/app/workspace/:sessionId" element={<WorkspacePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sign-to-language-view')).toBeInTheDocument();
    });

    // Sign recognition interface is present
    expect(screen.getByTestId('sign-recognition-panel')).toBeInTheDocument();

    // TextToSign panel and container views are NOT present
    expect(screen.queryByTestId('text-to-sign-panel')).toBeNull();
    expect(screen.queryByTestId('two-way-view')).toBeNull();
    expect(screen.queryByTestId('language-to-sign-view')).toBeNull();
  });

  it('renders ONLY Text to Sign interface when mode is language_to_sign', async () => {
    const session = await sessionRepository.create({
      title: 'Text to Sign Session',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'language_to_sign',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    render(
      <MemoryRouter initialEntries={[`/app/workspace/${session.id}`]}>
        <Routes>
          <Route path="/app/workspace/:sessionId" element={<WorkspacePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('language-to-sign-view')).toBeInTheDocument();
    });

    // Text-to-Sign panel is present
    expect(screen.getByTestId('text-to-sign-panel')).toBeInTheDocument();

    // Sign recognition panel is NOT present
    expect(screen.queryByTestId('sign-recognition-panel')).toBeNull();
    expect(screen.queryByTestId('two-way-view')).toBeNull();
    expect(screen.queryByTestId('sign-to-language-view')).toBeNull();
  });

  it('switches interfaces when switching mode inside the workspace', async () => {
    const session = await sessionRepository.create({
      title: 'Mode Switch Session',
      context: 'healthcare',
      signLanguage: 'LSA',
      spokenLang: 'fr',
      mode: 'two_way',
      status: 'active',
      aiMode: 'demo',
      privacy: 'local',
    });

    render(
      <MemoryRouter initialEntries={[`/app/workspace/${session.id}`]}>
        <Routes>
          <Route path="/app/workspace/:sessionId" element={<WorkspacePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('two-way-view')).toBeInTheDocument();
    });

    // Switch to Sign to Text mode via store or switcher
    await useSessionStore.getState().setSessionMode('sign_to_language');

    await waitFor(() => {
      expect(screen.getByTestId('sign-to-language-view')).toBeInTheDocument();
      expect(screen.queryByTestId('two-way-view')).toBeNull();
      expect(screen.queryByTestId('text-to-sign-panel')).toBeNull();
      expect(screen.getByTestId('sign-recognition-panel')).toBeInTheDocument();
    });

    // Switch to Text to Sign mode
    await useSessionStore.getState().setSessionMode('language_to_sign');

    await waitFor(() => {
      expect(screen.getByTestId('language-to-sign-view')).toBeInTheDocument();
      expect(screen.queryByTestId('sign-to-language-view')).toBeNull();
      expect(screen.queryByTestId('sign-recognition-panel')).toBeNull();
      expect(screen.getByTestId('text-to-sign-panel')).toBeInTheDocument();
    });

    // Switch back to two_way
    await useSessionStore.getState().setSessionMode('two_way');

    await waitFor(() => {
      expect(screen.getByTestId('two-way-view')).toBeInTheDocument();
      expect(screen.getByTestId('sign-recognition-panel')).toBeInTheDocument();
      expect(screen.getByTestId('text-to-sign-panel')).toBeInTheDocument();
    });
  });

  it('NewConversationPage passes mode from query param and persists selected mode', async () => {
    render(
      <MemoryRouter initialEntries={['/app/new?mode=sign_to_language']}>
        <Routes>
          <Route path="/app/new" element={<NewConversationPage />} />
          <Route path="/app/workspace/:id" element={<div data-testid="destination-workspace" />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify submit button exists and submit the form
    const submitBtn = screen.getByRole('button', { name: /Démarrer l'échange|Start conversation/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const currentSession = useSessionStore.getState().currentSession;
      expect(currentSession?.mode).toBe('sign_to_language');
      expect(useSettingsStore.getState().settings.lastMode).toBe('sign_to_language');
    });
  });
});
