import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { COMPILER_PHASES, type CompilationRecord, type Project } from '@/types/compiler';

function projectName(projects: Project[], projectId: string): string {
  return projects.find((p) => p.id === projectId)?.name ?? 'Unknown project';
}

function phaseLabel(phase: CompilationRecord['failedAtPhase']): string | null {
  if (!phase) return null;
  return COMPILER_PHASES.find((p) => p.key === phase)?.label ?? phase;
}

export function RecentCompilationsCard({
  compilations,
  projects,
}: {
  compilations: CompilationRecord[];
  projects: Project[];
}) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
        <h3 className="text-sm font-semibold">Recent Compilations</h3>
        <Link
          to="/history"
          className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>
      <ul className="divide-y divide-[var(--color-border-subtle)]">
        {compilations.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            {c.status === 'success' ? (
              <CheckCircle2 size={16} className="shrink-0 text-[var(--color-success)]" />
            ) : (
              <XCircle size={16} className="shrink-0 text-[var(--color-error)]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{projectName(projects, c.projectId)}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {formatDistanceToNow(new Date(c.timestamp), { addSuffix: true })}
              </p>
            </div>
            {c.status === 'failed' && c.failedAtPhase && (
              <Badge tone={c.failedAtPhase}>{phaseLabel(c.failedAtPhase)}</Badge>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
