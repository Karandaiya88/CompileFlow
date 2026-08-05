import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { LoadingState } from '@/components/feedback/AsyncState';
import {
  DashboardPage,
  ProjectsPage,
  WorkspacePage,
  GrammarLibraryPage,
  HistoryPage,
  ReportsPage,
  SettingsPage,
  HelpPage,
  NotFoundPage,
} from './lazyRoutes';

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<LoadingState label="Loading page" />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'projects', element: withSuspense(<ProjectsPage />) },
      { path: 'workspace', element: withSuspense(<WorkspacePage />) },
      { path: 'grammar-library', element: withSuspense(<GrammarLibraryPage />) },
      { path: 'history', element: withSuspense(<HistoryPage />) },
      { path: 'reports', element: withSuspense(<ReportsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'help', element: withSuspense(<HelpPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
