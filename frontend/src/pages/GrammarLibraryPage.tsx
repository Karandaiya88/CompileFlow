import { useEffect, useState } from 'react';
import { BookMarked } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { LoadingState, ErrorState } from '@/components/feedback/AsyncState';
import { compilerService } from '@/services/compilerService';
import type { GrammarDefinition } from '@/types/compiler';

/**
 * Fetches through compilerService.getGrammar() -- the same backend-ready
 * contract used by the Workspace -- rather than importing the mock fixture
 * directly, per Architecture.md Section 4.2.
 */
export function GrammarLibraryPage() {
  const [grammar, setGrammar] = useState<GrammarDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    compilerService
      .getGrammar('c-like-v1')
      .then((g) => {
        if (!cancelled) setGrammar(g);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load grammar.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader title="Grammar Library" description="Explore the supported C-like grammar." />

      {!grammar && !error && <LoadingState label="Loading grammar" />}
      {error && <ErrorState message={error} />}

      {grammar && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-3">
              <BookMarked size={16} className="text-[var(--color-phase-syntax)]" />
              <h3 className="text-sm font-semibold">{grammar.name}</h3>
            </div>
            <ul className="divide-y divide-[var(--color-border-subtle)] font-mono text-xs">
              {grammar.productions.map((prod, i) => (
                <li key={i} className="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
                  <span className="font-semibold text-[var(--color-phase-syntax)]">
                    {prod.lhs}
                  </span>
                  <span className="text-[var(--color-text-disabled)]">→</span>
                  {prod.rhs.map((symbol, j) => (
                    <span key={j} className="text-[var(--color-text-secondary)]">
                      {symbol}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold">Sample Program</h3>
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-bg-base)] p-3 font-mono text-xs leading-relaxed text-[var(--color-text-primary)]">
              {grammar.sampleProgram}
            </pre>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
              Copy this into the Compiler Workspace editor to see it move through the full
              pipeline.
            </p>
          </Card>
        </div>
      )}
    </>
  );
}
