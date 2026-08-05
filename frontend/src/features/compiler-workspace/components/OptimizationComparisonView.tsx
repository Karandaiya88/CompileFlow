import { ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TACInstruction } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

function InstructionList({ instructions }: { instructions: TACInstruction[] }) {
  return (
    <div className="flex flex-col gap-1 font-mono text-xs">
      {instructions.map((ins) => (
        <div
          key={ins.id}
          className="rounded-[var(--radius-sm)] bg-[var(--color-bg-surface-raised)] px-2 py-1"
        >
          <span className="text-[var(--color-phase-ir)]">{ins.op}</span>{' '}
          {[ins.arg1, ins.arg2].filter(Boolean).join(', ')}
          {ins.result && <span className="text-[var(--color-text-secondary)]"> → {ins.result}</span>}
        </div>
      ))}
    </div>
  );
}

/** Optimization Comparison -- PRD.md Section 8, SystemDesign.md Section 4.2. */
export function OptimizationComparisonView() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const optimization = result?.optimization;

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        The optimization comparison will appear here after you compile.
      </p>
    );
  }

  if (!optimization) {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        No optimization data available -- compilation didn't reach this phase.
      </p>
    );
  }

  const reduction = optimization.before.length - optimization.after.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
          Passes Applied
        </span>
        {optimization.passesApplied.map((pass) => (
          <Badge key={pass} tone="optimization">
            {pass}
          </Badge>
        ))}
      </div>

      {reduction > 0 && (
        <p className="text-xs text-[var(--color-success)]">
          Reduced {optimization.before.length} instructions to {optimization.after.length} (−
          {reduction}).
        </p>
      )}

      <Card padding="tight">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
          Before
        </p>
        <InstructionList instructions={optimization.before} />
      </Card>

      <div className="flex justify-center text-[var(--color-text-disabled)]">
        <ArrowDown size={16} />
      </div>

      <Card padding="tight" className="border-[var(--color-phase-opt)]/40">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-phase-opt)]">
          After
        </p>
        <InstructionList instructions={optimization.after} />
      </Card>
    </div>
  );
}
