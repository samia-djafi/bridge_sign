import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { PublicEntryRedirect, RequireOnboarding } from './guards';
import { PublicEntryPage } from '@/features/public-entry/PublicEntryPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { NewConversationPage } from '@/features/new-conversation/NewConversationPage';
import { WorkspacePage } from '@/features/workspace/WorkspacePage';
import { SingleModePage } from '@/features/single-mode/SingleModePage';
import { PhrasebookPage } from '@/features/phrasebook/PhrasebookPage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { HistoryDetailPage } from '@/features/history/HistoryDetailPage';
import { DiagnosticsPage } from '@/features/diagnostics/DiagnosticsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AboutPage } from '@/features/about/AboutPage';
import { DesignPage } from '@/features/design/DesignPage';
import { NotFoundPage } from '@/features/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicEntryRedirect>
        <PublicEntryPage />
      </PublicEntryRedirect>
    ),
  },
  {
    path: '/app/onboarding',
    element: <OnboardingPage />,
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
        element: <DashboardPage />,
      },
      {
        path: 'new',
        element: <NewConversationPage />,
      },
      {
        path: 'workspace/:sessionId',
        element: <WorkspacePage />,
      },
      {
        path: 'sign-to-language',
        element: <SingleModePage />,
      },
      {
        path: 'language-to-sign',
        element: <SingleModePage />,
      },
      {
        path: 'phrasebook',
        element: <PhrasebookPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'history/:sessionId',
        element: <HistoryDetailPage />,
      },
      {
        path: 'diagnostics',
        element: <DiagnosticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'design',
        element: <DesignPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
