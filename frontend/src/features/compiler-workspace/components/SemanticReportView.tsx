import { useMemo } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useWorkspaceStore } from '../store/workspaceStore';

/**
 * Semantic Report -- PRD.md Section 8. Distinct from the general
 * Diagnostics tab: this view scopes strictly to semantic-phase findings
 * (type checks, scope resolution) plus a scope-by-scope symbol summary,
 * rather than every diagnostic across the whole pipeline.
 */
export function SemanticReportView() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);

  const semanticDiagnostics = useMemo(
    () => (result?.diagnostics ?? []).filter((d) => d.phase === 'semantic'),
    [result],
  );

  const scopeGroups = useMemo(() => {
    const symbols = result?.symbolTable ?? [];
    const groups = new Map<string, typeof symbols>();
    for (const s of symbols) {
      const list = groups.get(s.scope) ?? [];
      list.push(s);
      groups.set(s.scope, list);
    }
    return Array.from(groups.entries());
  }, [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        The semantic report will appear here after you compile.
      </p>
    );
  }

  const reachedSemantic =
    result?.status === 'success' ||
    (result?.status === 'failed' &&
      result.failedAtPhase &&
      ['semantic', 'intermediate', 'optimization', 'codegen'].includes(result.failedAtPhase));

  if (!reachedSemantic) {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        Semantic analysis never ran -- compilation failed at an earlier phase (
        {result?.failedAtPhase}).
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Card
        padding="tight"
        className={
          semanticDiagnostics.length === 0
            ? 'flex items-center gap-2 border-[var(--color-success)]/40'
            : 'flex items-center gap-2 border-[var(--color-error)]/40'
        }
      >
        {semanticDiagnostics.length === 0 ? (
          <>
            <CheckCircle2 size={16} className="text-[var(--color-success)]" />
            <span className="text-sm font-medium">Type checking and scope resolution passed.</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} className="text-[var(--color-error)]" />
            <span className="text-sm font-medium">
              {semanticDiagnostics.length} semantic issue{semanticDiagnostics.length > 1 ? 's' : ''}{' '}
              found.
            </span>
          </>
        )}
      </Card>

      {semanticDiagnostics.length > 0 && (
        <ul className="flex flex-col gap-2">
          {semanticDiagnostics.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] p-3"
            >
              {d.severity === 'error' ? (
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--color-error)]" />
              ) : (
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[var(--color-warning)]" />
              )}
              <div>
                <p className="text-sm">{d.message}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Line {d.line}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
          Scope Summary
        </p>
        {scopeGroups.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No scopes with symbols.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {scopeGroups.map(([scope, symbols]) => (
              <Card key={scope} padding="tight">
                <div className="mb-1.5 flex items-center gap-2">
                  <Badge tone="semantic">{scope}</Badge>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {symbols.length} symbol{symbols.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  {symbols.map((s) => `${s.type} ${s.name}`).join(', ')}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
