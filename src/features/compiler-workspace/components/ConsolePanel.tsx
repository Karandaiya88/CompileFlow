import { useWorkspaceStore } from '../store/workspaceStore';

/**
 * Console panel -- PRD.md Section 8. Sprint 3: shows a simple compile
 * status log. Real streaming output arrives once a real backend exists.
 */
export function ConsolePanel() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const errorMessage = useWorkspaceStore((s) => s.errorMessage);

  return (
    <div className="h-full overflow-y-auto rounded-[var(--radius-md)] bg-[var(--color-bg-base)] p-3 font-mono text-xs leading-relaxed">
      <p className="text-[var(--color-text-disabled)]">$ smartcc compile --source ./main.sc</p>
      {status === 'idle' && (
        <p className="text-[var(--color-text-secondary)]">Waiting for compile...</p>
      )}
      {status === 'compiling' && (
        <p className="text-[var(--color-info)]">Running pipeline...</p>
      )}
      {status === 'success' && result?.status === 'success' && (
        <>
          <p className="text-[var(--color-success)]">✓ Compilation succeeded.</p>
          <p className="text-[var(--color-text-secondary)]">
            {result.tokens.length} tokens · {result.symbolTable.length} symbols ·{' '}
            {result.tac.length} TAC instructions
          </p>
        </>
      )}
      {status === 'success' && result?.status === 'failed' && (
        <p className="text-[var(--color-error)]">
          ✗ Compilation failed at phase: {result.failedAtPhase}
        </p>
      )}
      {status === 'error' && (
        <p className="text-[var(--color-error)]">✗ {errorMessage ?? 'Unexpected error.'}</p>
      )}
    </div>
  );
}
