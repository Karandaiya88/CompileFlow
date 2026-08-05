import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { COMPILER_PHASES } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

function phaseLabel(phase: string): string {
  return COMPILER_PHASES.find((p) => p.key === phase)?.label ?? phase;
}

/**
 * Error Panel -- PRD.md Section 8. Groups diagnostics by phase, per
 * SystemDesign.md Section 5: "the core pedagogical value of the product
 * -- must never be diluted into a flat, unstructured error list."
 */
export function ErrorPanel() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        Diagnostics will appear here after you compile.
      </p>
    );
  }

  const diagnostics = result?.diagnostics ?? [];

  if (diagnostics.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-[var(--color-success)]">
        <CheckCircle2 size={16} />
        No errors or warnings.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 p-3">
      {diagnostics.map((d, i) => (
        <li
          key={i}
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] p-3"
        >
          {d.severity === 'error' ? (
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--color-error)]" />
          ) : (
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge tone={d.phase}>{phaseLabel(d.phase)}</Badge>
              <span className="text-xs text-[var(--color-text-secondary)]">Line {d.line}</span>
            </div>
            <p className="text-sm">{d.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
