import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { PublicEntryRedirect, RequireOnboarding } from './guards';

const PublicEntryPage = lazy(() => import('@/features/public-entry/PublicEntryPage').then(m => ({ default: m.PublicEntryPage })));
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const NewConversationPage = lazy(() => import('@/features/new-conversation/NewConversationPage').then(m => ({ default: m.NewConversationPage })));
const WorkspacePage = lazy(() => import('@/features/workspace/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const SingleModePage = lazy(() => import('@/features/single-mode/SingleModePage').then(m => ({ default: m.SingleModePage })));
const PhrasebookPage = lazy(() => import('@/features/phrasebook/PhrasebookPage').then(m => ({ default: m.PhrasebookPage })));
const HistoryPage = lazy(() => import('@/features/history/HistoryPage').then(m => ({ default: m.HistoryPage })));
const HistoryDetailPage = lazy(() => import('@/features/history/HistoryDetailPage').then(m => ({ default: m.HistoryDetailPage })));
const DiagnosticsPage = lazy(() => import('@/features/diagnostics/DiagnosticsPage').then(m => ({ default: m.DiagnosticsPage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AboutPage = lazy(() => import('@/features/about/AboutPage').then(m => ({ default: m.AboutPage })));
const StoriesPage = lazy(() => import('@/features/stories/StoriesPage').then(m => ({ default: m.StoriesPage })));
const DesignPage = lazy(() => import('@/features/design/DesignPage').then(m => ({ default: m.DesignPage })));
const NotFoundPage = lazy(() => import('@/features/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-[50vh] p-8 text-app-muted text-sm font-medium animate-pulse">
        Loading BridgeSign…
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicEntryRedirect>
        <SuspenseWrapper>
          <PublicEntryPage />
        </SuspenseWrapper>
      </PublicEntryRedirect>
    ),
  },
  {
    path: '/app/onboarding',
    element: (
      <SuspenseWrapper>
        <OnboardingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/app',
    element: (
      <RequireOnboarding>
        <AppShell />
      </RequireOnboarding>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'new',
        element: (
          <SuspenseWrapper>
            <NewConversationPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'workspace/:sessionId',
        element: (
          <SuspenseWrapper>
            <WorkspacePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sign-to-language',
        element: (
          <SuspenseWrapper>
            <SingleModePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'language-to-sign',
        element: (
          <SuspenseWrapper>
            <SingleModePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'phrasebook',
        element: (
          <SuspenseWrapper>
            <PhrasebookPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'stories',
        element: (
          <SuspenseWrapper>
            <StoriesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'history',
        element: (
          <SuspenseWrapper>
            <HistoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'history/:sessionId',
        element: (
          <SuspenseWrapper>
            <HistoryDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'diagnostics',
        element: (
          <SuspenseWrapper>
            <DiagnosticsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper>
            <AboutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'design',
        element: (
          <SuspenseWrapper>
            <DesignPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);
