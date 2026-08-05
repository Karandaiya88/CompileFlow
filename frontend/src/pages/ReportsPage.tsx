import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { LoadingState, ErrorState } from '@/components/feedback/AsyncState'
import { historyService } from '@/features/history/historyService'
import { deriveReportStats } from '@/features/reports/deriveReportStats'
import { PhaseFailureChart } from '@/features/reports/components/PhaseFailureChart'
import type { CompilationRecord } from '@/types/compiler'

export function ReportsPage() {
  const [records, setRecords] = useState<CompilationRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    historyService
      .getAll()
      .then((r) => {
        if (!cancelled) setRecords(r)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load reports.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!records && !error) return <LoadingState label="Loading reports" />
  if (error) return <ErrorState message={error} />

  const stats = deriveReportStats(records ?? [])

  return (
    <>
      <PageHeader title="Reports" description="Aggregate insights across your compilations." />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">Total Compilations</p>
          <p className="mt-2 font-mono text-3xl font-semibold">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">Success Rate</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-[var(--color-success)]">
            {stats.successRate}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">Failed Compilations</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-[var(--color-error)]">
            {stats.failedCount}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">Most Common Failure</p>
          <p className="mt-2 text-lg font-semibold">
            {stats.mostCommonFailurePhase ?? 'None yet'}
          </p>
        </Card>
      </div>

      <PhaseFailureChart data={stats.phaseFailures} />
    </>
  )
}
