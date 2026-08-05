import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

/**
 * Shared loading/error presentation -- Architecture.md Section 6:
 * "Loading and error states are handled by a shared wrapper, not
 * duplicated per component." Data-fetching logic itself still lives in
 * each feature's hook (e.g. useDashboardData) per Rules.md Section 4.1.
 */
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="h-24 animate-pulse">
          <div className="h-3 w-20 rounded bg-[var(--color-bg-surface-raised)]" />
          <div className="mt-3 h-6 w-16 rounded bg-[var(--color-bg-surface-raised)]" />
        </Card>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="flex items-center gap-3 border-[var(--color-error)]/40">
      <AlertTriangle size={18} className="shrink-0 text-[var(--color-error)]" />
      <div>
        <p className="text-sm font-medium">Couldn't load this data</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{message}</p>
      </div>
    </Card>
  );
}
