import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import type { AssemblyLine } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

const columns: ColumnDef<AssemblyLine, unknown>[] = [
  {
    header: '#',
    accessorKey: 'instruction',
    cell: (ctx) => <span className="text-[var(--color-text-disabled)]">{ctx.row.index + 1}</span>,
  },
  {
    header: 'Instruction',
    accessorKey: 'instruction',
    cell: (ctx) => (
      <span className="font-semibold text-[var(--color-phase-codegen)]">
        {ctx.getValue<string>()}
      </span>
    ),
  },
  {
    header: 'Operands',
    accessorKey: 'operands',
    cell: (ctx) => ctx.getValue<string[]>().join(', ') || '—',
  },
  {
    header: 'Comment',
    accessorKey: 'comment',
    cell: (ctx) => (
      <span className="italic text-[var(--color-text-disabled)]">
        {ctx.getValue<string | undefined>() ?? ''}
      </span>
    ),
  },
];

/** Assembly Viewer -- PRD.md Section 8, SystemDesign.md Section 4.2. */
export function AssemblyViewer() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const assembly = useMemo(() => result?.assembly ?? [], [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        Target assembly will appear here after you compile.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={assembly}
      emptyMessage="No assembly generated -- compilation didn't reach code generation."
    />
  );
}
