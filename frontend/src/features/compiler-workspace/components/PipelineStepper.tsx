import { Check, X, Loader2 } from 'lucide-react';
import { COMPILER_PHASES, type CompilerPhase, type CompilationResult } from '@/types/compiler';
import { cn } from '@/lib/cn';
import { useWorkspaceStore, type CompileStatus } from '../store/workspaceStore';

type StepState = 'pending' | 'compiling' | 'done' | 'failed';

const PHASE_COLOR_VAR: Record<CompilerPhase, string> = {
  lexical: 'var(--color-phase-lexical)',
  syntax: 'var(--color-phase-syntax)',
  semantic: 'var(--color-phase-semantic)',
  intermediate: 'var(--color-phase-ir)',
  optimization: 'var(--color-phase-opt)',
  codegen: 'var(--color-phase-codegen)',
};

function getStepStates(
  status: CompileStatus,
  result: CompilationResult | null,
): Record<CompilerPhase, StepState> {
  const base = Object.fromEntries(
    COMPILER_PHASES.map((p) => [p.key, 'pending' as StepState]),
  ) as Record<CompilerPhase, StepState>;

  if (status === 'compiling') {
    base.lexical = 'compiling';
    return base;
  }

  if (status === 'done' && result) {
    if (result.status === 'success') {
      for (const p of COMPILER_PHASES) base[p.key] = 'done';
      return base;
    }
    const failedIndex = result.failedAtPhase
      ? COMPILER_PHASES.findIndex((p) => p.key === result.failedAtPhase)
      : -1;
    COMPILER_PHASES.forEach((p, i) => {
      if (failedIndex === -1) return;
      if (i < failedIndex) base[p.key] = 'done';
      else if (i === failedIndex) base[p.key] = 'failed';
    });
    return base;
  }

  return base;
}

function StepIcon({ state, color }: { state: StepState; color: string }) {
  if (state === 'done')
    return (
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Check size={14} className="text-black/80" />
      </div>
    );
  if (state === 'failed')
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-error)]">
        <X size={14} className="text-white" />
      </div>
    );
  if (state === 'compiling')
    return (
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full border-2"
        style={{ borderColor: color }}
      >
        <Loader2 size={14} className="animate-spin" style={{ color }} />
      </div>
    );
  return (
    <div className="h-7 w-7 rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-surface)]" />
  );
}

/** Compiler Pipeline stepper -- PRD.md Section 8, core Workspace requirement. */
export function PipelineStepper() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const states = getStepStates(status, result);

  return (
    <div className="flex items-center justify-between overflow-x-auto px-1 py-2">
      {COMPILER_PHASES.map((phase, i) => {
        const state = states[phase.key];
        const color = PHASE_COLOR_VAR[phase.key];
        return (
          <div key={phase.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <StepIcon state={state} color={color} />
              <span
                className={cn(
                  'whitespace-nowrap text-[11px] font-medium',
                  state === 'pending'
                    ? 'text-[var(--color-text-disabled)]'
                    : 'text-[var(--color-text-secondary)]',
                )}
              >
                {phase.label}
              </span>
            </div>
            {i < COMPILER_PHASES.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-px flex-1',
                  state === 'done' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border-subtle)]',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
