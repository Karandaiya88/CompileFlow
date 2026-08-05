import type { CompilerPhase, CompilationRecord, Project } from '@/types/compiler';

/** Top-level stat cards -- PRD.md Section 9. */
export interface DashboardStatCard {
  id: string;
  label: string;
  value: string;
  delta?: { value: string; direction: 'up' | 'down' };
}

/** Phase-wise average execution time -- feeds the Pipeline Status widget. */
export interface PhaseMetric {
  phase: CompilerPhase;
  label: string;
  avgMs: number;
}

/** Daily compilation volume -- feeds the trend chart. */
export interface CompilationTrendPoint {
  date: string; // "Jul 17"
  successful: number;
  failed: number;
}

export interface DashboardData {
  stats: DashboardStatCard[];
  recentProjects: Project[];
  recentCompilations: CompilationRecord[];
  phaseMetrics: PhaseMetric[];
  compilationTrend: CompilationTrendPoint[];
}
