import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/data-table/DataTable'
import { LoadingState, ErrorState } from '@/components/feedback/AsyncState'
import { cn } from '@/lib/cn'
import { historyService } from '@/features/history/historyService'
import { PROJECT_NAMES } from '@/features/history/mocks/historyRecords'
import { COMPILER_PHASES, type CompilationRecord, type CompilerPhase } from '@/types/compiler'

type StatusFilter = 'all' | 'success' | 'failed'

function phaseLabel(phase: string): string {
  return COMPILER_PHASES.find((p) => p.key === phase)?.label ?? phase
}

const columns: ColumnDef<CompilationRecord, unknown>[] = [
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (ctx) =>
      ctx.getValue<string>() === 'success' ? (
        <CheckCircle2 size={15} className="text-[var(--color-success)]" />
      ) : (
        <XCircle size={15} className="text-[var(--color-error)]" />
      ),
  },
  {
    header: 'Project',
    accessorKey: 'projectId',
    cell: (ctx) => (
      <span className="font-sans text-[var(--color-text-primary)]">
        {PROJECT_NAMES[ctx.getValue<string>()] ?? ctx.getValue<string>()}
      </span>
    ),
  },
  {
    header: 'When',
    accessorKey: 'timestamp',
    cell: (ctx) => formatDistanceToNow(new Date(ctx.getValue<string>()), { addSuffix: true }),
  },
  {
    header: 'Failed At',
    accessorKey: 'failedAtPhase',
    cell: (ctx) => {
      const phase = ctx.getValue<string | null>()
      if (!phase) return <span className="text-[var(--color-text-disabled)]">—</span>
      return <Badge tone={phase as CompilerPhase}>{phaseLabel(phase)}</Badge>
    },
  },
]

export function HistoryPage() {
  const [records, setRecords] = useState<CompilationRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    let cancelled = false
    historyService
      .getAll()
      .then((r) => {
        if (!cancelled) setRecords(r)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load history.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!records) return []
    if (filter === 'all') return records
    return records.filter((r) => r.status === filter)
  }, [records, filter])

  return (
    <>
      <PageHeader title="Compilation History" description="Review past compilation runs." />

      <div className="mb-4 flex gap-2">
        {(['all', 'success', 'failed'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-[var(--radius-md)] border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-white'
                : 'border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {!records && !error && <LoadingState label="Loading history" />}
      {error && <ErrorState message={error} />}
      {records && (
        <DataTable columns={columns} data={filtered} emptyMessage="No compilations match this filter." />
      )}
    </>
  )
}
