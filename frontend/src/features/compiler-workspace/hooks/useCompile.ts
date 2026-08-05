import { useCallback } from 'react';
import { compilerService } from '@/services/compilerService';
import { useWorkspaceStore } from '../store/workspaceStore';

/**
 * Per Rules.md Section 4.1: every async operation explicitly handles
 * loading, error, and success states -- no silent failures. This hook is
 * the only place that calls compilerService.compile(); components never
 * call the service directly.
 */
export function useCompile() {
  const sourceCode = useWorkspaceStore((s) => s.sourceCode);
  const status = useWorkspaceStore((s) => s.status);
  const startCompiling = useWorkspaceStore((s) => s.startCompiling);
  const compileSucceeded = useWorkspaceStore((s) => s.compileSucceeded);
  const compileFailed = useWorkspaceStore((s) => s.compileFailed);

  const compile = useCallback(async () => {
    startCompiling();
    try {
      const result = await compilerService.compile(sourceCode);
      compileSucceeded(result);
    } catch (err) {
      compileFailed(err instanceof Error ? err.message : 'Compilation failed unexpectedly.');
    }
  }, [sourceCode, startCompiling, compileSucceeded, compileFailed]);

  return { compile, isCompiling: status === 'compiling' };
}
