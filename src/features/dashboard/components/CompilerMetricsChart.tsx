import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { PhaseMetric } from '../types';

const PHASE_COLOR_VAR: Record<PhaseMetric['phase'], string> = {
  lexical: 'var(--color-phase-lexical)',
  syntax: 'var(--color-phase-syntax)',
  semantic: 'var(--color-phase-semantic)',
  intermediate: 'var(--color-phase-ir)',
  optimization: 'var(--color-phase-opt)',
  codegen: 'var(--color-phase-codegen)',
};

interface TooltipPayloadItem {
  payload: PhaseMetric;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] px-3 py-2 text-xs shadow-[var(--shadow-modal)]">
      <p className="font-medium">{item.label}</p>
      <p className="text-[var(--color-text-secondary)]">{item.avgMs}ms average</p>
    </div>
  );
}

/** Compiler Metrics chart -- PRD.md Section 9, phase-wise avg execution time. */
export function CompilerMetricsChart({ phaseMetrics }: { phaseMetrics: PhaseMetric[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold">Compiler Metrics — Avg. Time per Phase</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={phaseMetrics} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border-subtle)' }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit="ms"
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-bg-surface-raised)' }} />
            <Bar dataKey="avgMs" radius={[4, 4, 0, 0]}>
              {phaseMetrics.map((m) => (
                <Cell key={m.phase} fill={PHASE_COLOR_VAR[m.phase]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
