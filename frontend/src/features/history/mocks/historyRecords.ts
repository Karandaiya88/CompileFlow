import type { CompilationRecord } from '@/types/compiler';

/**
 * Richer history fixture than compilerService.getHistory()'s 2-item mock
 * (that one exists for Workspace-contextual use). This is the dedicated
 * History page dataset -- SystemDesign.md Section 4.4.
 */
export const historyRecords: CompilationRecord[] = [
  { id: 'comp_9190', projectId: 'proj_42', timestamp: '2026-07-29T14:20:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9189', projectId: 'proj_42', timestamp: '2026-07-29T11:05:00Z', status: 'failed', failedAtPhase: 'semantic' },
  { id: 'comp_9188', projectId: 'proj_43', timestamp: '2026-07-28T18:40:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9187', projectId: 'proj_43', timestamp: '2026-07-28T16:12:00Z', status: 'failed', failedAtPhase: 'syntax' },
  { id: 'comp_9186', projectId: 'proj_44', timestamp: '2026-07-27T09:55:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9185', projectId: 'proj_42', timestamp: '2026-07-26T20:30:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9184', projectId: 'proj_44', timestamp: '2026-07-25T13:15:00Z', status: 'failed', failedAtPhase: 'lexical' },
  { id: 'comp_9183', projectId: 'proj_43', timestamp: '2026-07-24T08:00:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9182', projectId: 'proj_42', timestamp: '2026-07-23T17:45:00Z', status: 'success', failedAtPhase: null },
  { id: 'comp_9181', projectId: 'proj_42', timestamp: '2026-07-22T10:10:00Z', status: 'failed', failedAtPhase: 'semantic' },
];

export const PROJECT_NAMES: Record<string, string> = {
  proj_42: 'Arithmetic Expressions Lab',
  proj_43: 'Control Flow Assignment',
  proj_44: 'Function Declarations Practice',
};
