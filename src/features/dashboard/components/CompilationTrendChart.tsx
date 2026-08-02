import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { CompilationTrendPoint } from '../types';

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] px-3 py-2 text-xs shadow-[var(--shadow-modal)]">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          style={{
            color: p.dataKey === 'successful' ? 'var(--color-success)' : 'var(--color-error)',
          }}
        >
          {p.dataKey === 'successful' ? 'Successful' : 'Failed'}: {p.value}
        </p>
      ))}
    </div>
  );
}

/** Compilation Trend chart -- PRD.md Section 9 "Charts" requirement. */
export function CompilationTrendChart({ trend }: { trend: CompilationTrendPoint[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold">Compilation Trend — Last 7 Days</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-error)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-error)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border-subtle)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="successful"
              stroke="var(--color-success)"
              fill="url(#successGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="failed"
              stroke="var(--color-error)"
              fill="url(#failedGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
