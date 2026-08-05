import { lazy } from 'react';

// Route-level code splitting -- Architecture.md Section 7 (Performance NFR).
// Keeps chart-heavy pages (Dashboard/recharts) and the Monaco/React-Flow-heavy
// Workspace page out of the initial bundle. Split into its own file (rather
// than living alongside `router`) so this file exports components only --
// satisfies react-refresh's only-export-components lint rule.
export const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
export const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
export const WorkspacePage = lazy(() =>
  import('@/pages/WorkspacePage').then((m) => ({ default: m.WorkspacePage })),
);
export const GrammarLibraryPage = lazy(() =>
  import('@/pages/GrammarLibraryPage').then((m) => ({ default: m.GrammarLibraryPage })),
);
export const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage })),
);
export const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
export const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
export const HelpPage = lazy(() =>
  import('@/pages/HelpPage').then((m) => ({ default: m.HelpPage })),
);
export const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
