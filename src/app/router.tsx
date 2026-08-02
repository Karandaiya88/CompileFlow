import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { LoadingState } from '@/components/feedback/AsyncState';

// Route-level code splitting -- Architecture.md Section 7 (Performance NFR).
// Keeps chart-heavy pages (Dashboard/recharts) and the future Monaco-heavy
// Workspace page out of the initial bundle.
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const WorkspacePage = lazy(() =>
  import('@/pages/WorkspacePage').then((m) => ({ default: m.WorkspacePage })),
);
const GrammarLibraryPage = lazy(() =>
  import('@/pages/GrammarLibraryPage').then((m) => ({ default: m.GrammarLibraryPage })),
);
const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage })),
);
const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const HelpPage = lazy(() => import('@/pages/HelpPage').then((m) => ({ default: m.HelpPage })));
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

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
