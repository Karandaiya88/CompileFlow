import { Play, Loader2 } from 'lucide-react';
import { useCompile } from '../hooks/useCompile';

export function CompileButton() {
  const { compile, isCompiling } = useCompile();

  return (
    <button
      type="button"
      onClick={compile}
      disabled={isCompiling}
      className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent-primary)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isCompiling ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Play size={15} fill="currentColor" />
      )}
      {isCompiling ? 'Compiling...' : 'Compile'}
    </button>
  );
}
