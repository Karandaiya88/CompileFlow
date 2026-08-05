import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { PhaseFailureCount } from '../deriveReportStats';
import type { CompilerPhase } from '@/types/compiler';

const PHASE_COLOR_VAR: Record<CompilerPhase, string> = {
  lexical: 'var(--color-phase-lexical)',
  syntax: 'var(--color-phase-syntax)',
  semantic: 'var(--color-phase-semantic)',
  intermediate: 'var(--color-phase-ir)',
  optimization: 'var(--color-phase-opt)',
  codegen: 'var(--color-phase-codegen)',
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PhaseFailureCount }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] px-3 py-2 text-xs shadow-[var(--shadow-modal)]">
      <p className="font-medium">{item.label}</p>
      <p className="text-[var(--color-text-secondary)]">
        {item.count} failure{item.count === 1 ? '' : 's'}
      </p>
    </div>
  );
}

export function PhaseFailureChart({ data }: { data: PhaseFailureCount[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold">Failures by Phase</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
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
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-bg-surface-raised)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.phase} fill={PHASE_COLOR_VAR[d.phase]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
