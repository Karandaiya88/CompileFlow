import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { PhaseMetric } from '../types';

/**
 * Pipeline Status widget -- PRD.md Section 9.
 * Sprint 2 mock data has no real "degraded/down" signal yet (that requires
 * a live backend, v2+), so every phase renders as healthy. The structure
 * is in place now so real health data can populate it later without a
 * component rewrite.
 */
export function PipelineStatusCard({ phaseMetrics }: { phaseMetrics: PhaseMetric[] }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
        <h3 className="text-sm font-semibold">Pipeline Status</h3>
      </div>
      <ul className="divide-y divide-[var(--color-border-subtle)]">
        {phaseMetrics.map((m) => (
          <li key={m.phase} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Badge tone={m.phase}>{m.label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" aria-hidden />
              <span className="text-xs text-[var(--color-text-secondary)]">
                Healthy · avg {m.avgMs}ms
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
