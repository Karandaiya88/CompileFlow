import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ASTNode } from '@/types/compiler';

function summarizeMetadata(metadata?: Record<string, unknown>): string | null {
  if (!metadata) return null;
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(', ');
}

/**
 * Custom node renderer for the Parse Tree -- Design.md Section 7 card
 * standards (radius-lg, border-subtle) applied at node scale, with the
 * syntax-phase accent color since AST is the Syntax Analysis output.
 */
export function ASTNodeCard({ data }: NodeProps) {
  const node = data.node as ASTNode;
  const summary = summarizeMetadata(node.metadata);

  return (
    <div className="w-40 rounded-[var(--radius-md)] border border-[var(--color-phase-syntax)]/40 bg-[var(--color-bg-surface-raised)] px-3 py-2 shadow-[var(--shadow-panel)]">
      <Handle type="target" position={Position.Top} className="!bg-[var(--color-border-strong)]" />
      <p className="truncate font-mono text-xs font-semibold text-[var(--color-phase-syntax)]">
        {node.kind}
      </p>
      {summary && (
        <p className="mt-0.5 truncate text-[10px] text-[var(--color-text-secondary)]">{summary}</p>
      )}
      <p className="mt-0.5 text-[10px] text-[var(--color-text-disabled)]">Line {node.line}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[var(--color-border-strong)]"
      />
    </div>
  );
}
