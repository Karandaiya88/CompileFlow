import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { DashboardStatCard } from '../types';

export function StatCard({ label, value, delta }: DashboardStatCard) {
  return (
    <Card>
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-mono text-3xl font-semibold tracking-tight">{value}</p>
        {delta && (
          <span
            className={
              delta.direction === 'up'
                ? 'flex items-center gap-0.5 text-xs font-medium text-[var(--color-success)]'
                : 'flex items-center gap-0.5 text-xs font-medium text-[var(--color-error)]'
            }
          >
            {delta.direction === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {delta.value}
          </span>
        )}
      </div>
    </Card>
  );
}
