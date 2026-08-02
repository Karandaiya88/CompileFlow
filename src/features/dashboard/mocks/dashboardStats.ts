import type { DashboardData } from '../types';

function daysAgoIso(days: number, hours = 0): string {
  return new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString();
}

/**
 * Mock dashboard fixture -- Architecture.md Section 4.2, SystemDesign.md Section 4.1.
 * Numbers are illustrative but internally consistent (recentCompilations status
 * mix matches the trend chart's success/fail shape).
 */
export const dashboardStats: DashboardData = {
  stats: [
    { id: 'projects', label: 'Total Projects', value: '6' },
    { id: 'compilations', label: 'Total Compilations', value: '212', delta: { value: '+18 this week', direction: 'up' } },
    { id: 'success-rate', label: 'Success Rate', value: '87%', delta: { value: '+3%', direction: 'up' } },
    { id: 'avg-time', label: 'Avg. Compile Time', value: '142ms' },
  ],
  recentProjects: [
    { id: 'proj_1', name: 'Arithmetic Expressions Demo', createdAt: daysAgoIso(20), updatedAt: daysAgoIso(0, 2), language: 'c-like' },
    { id: 'proj_2', name: 'Control Flow Practice', createdAt: daysAgoIso(14), updatedAt: daysAgoIso(1), language: 'c-like' },
    { id: 'proj_3', name: 'Function Declarations Lab', createdAt: daysAgoIso(9), updatedAt: daysAgoIso(3), language: 'c-like' },
    { id: 'proj_4', name: 'Loop Optimization Exercise', createdAt: daysAgoIso(5), updatedAt: daysAgoIso(5), language: 'c-like' },
  ],
  recentCompilations: [
    { id: 'comp_9182', projectId: 'proj_1', timestamp: daysAgoIso(0, 1), status: 'success', failedAtPhase: null },
    { id: 'comp_9181', projectId: 'proj_2', timestamp: daysAgoIso(0, 3), status: 'failed', failedAtPhase: 'semantic' },
    { id: 'comp_9180', projectId: 'proj_1', timestamp: daysAgoIso(0, 5), status: 'success', failedAtPhase: null },
    { id: 'comp_9179', projectId: 'proj_3', timestamp: daysAgoIso(1), status: 'failed', failedAtPhase: 'syntax' },
    { id: 'comp_9178', projectId: 'proj_4', timestamp: daysAgoIso(1, 4), status: 'success', failedAtPhase: null },
  ],
  phaseMetrics: [
    { phase: 'lexical', label: 'Lexical Analysis', avgMs: 8 },
    { phase: 'syntax', label: 'Syntax Analysis', avgMs: 22 },
    { phase: 'semantic', label: 'Semantic Analysis', avgMs: 31 },
    { phase: 'intermediate', label: 'Intermediate Code', avgMs: 18 },
    { phase: 'optimization', label: 'Optimization', avgMs: 40 },
    { phase: 'codegen', label: 'Code Generation', avgMs: 23 },
  ],
  compilationTrend: [
    { date: 'Jul 17', successful: 14, failed: 3 },
    { date: 'Jul 18', successful: 18, failed: 2 },
    { date: 'Jul 19', successful: 9, failed: 4 },
    { date: 'Jul 20', successful: 21, failed: 1 },
    { date: 'Jul 21', successful: 16, failed: 5 },
    { date: 'Jul 22', successful: 24, failed: 2 },
    { date: 'Jul 23', successful: 19, failed: 3 },
  ],
};
