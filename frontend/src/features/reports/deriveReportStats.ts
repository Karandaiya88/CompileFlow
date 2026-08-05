import { COMPILER_PHASES, type CompilationRecord, type CompilerPhase } from '@/types/compiler';

export interface PhaseFailureCount {
  phase: CompilerPhase;
  label: string;
  count: number;
}

export interface ReportStats {
  total: number;
  successCount: number;
  failedCount: number;
  successRate: number; // 0-100
  phaseFailures: PhaseFailureCount[];
  mostCommonFailurePhase: string | null;
}

/**
 * Derives aggregate report stats client-side from compilation history --
 * no separate reports fixture needed, per SystemDesign.md Section 4.5.
 * Pure function: easy to unit test in isolation (Testing.md Section 2.1).
 */
export function deriveReportStats(records: CompilationRecord[]): ReportStats {
  const total = records.length;
  const successCount = records.filter((r) => r.status === 'success').length;
  const failedCount = total - successCount;
  const successRate = total === 0 ? 0 : Math.round((successCount / total) * 100);

  const phaseFailures: PhaseFailureCount[] = COMPILER_PHASES.map((p) => ({
    phase: p.key,
    label: p.label,
    count: records.filter((r) => r.status === 'failed' && r.failedAtPhase === p.key).length,
  }));

  const topPhase = phaseFailures.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    phaseFailures[0],
  );

  return {
    total,
    successCount,
    failedCount,
    successRate,
    phaseFailures,
    mostCommonFailurePhase: topPhase.count > 0 ? topPhase.label : null,
  };
}
