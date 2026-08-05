import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import type { TACInstruction } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

const columns: ColumnDef<TACInstruction, unknown>[] = [
  {
    header: '#',
    accessorKey: 'id',
    cell: (ctx) => <span className="text-[var(--color-text-disabled)]">{ctx.row.index + 1}</span>,
  },
  {
    header: 'Op',
    accessorKey: 'op',
    cell: (ctx) => (
      <span className="font-semibold text-[var(--color-phase-ir)]">{ctx.getValue<string>()}</span>
    ),
  },
  { header: 'Arg 1', accessorKey: 'arg1', cell: (ctx) => ctx.getValue<string>() ?? '—' },
  { header: 'Arg 2', accessorKey: 'arg2', cell: (ctx) => ctx.getValue<string>() ?? '—' },
  { header: 'Result', accessorKey: 'result', cell: (ctx) => ctx.getValue<string>() ?? '—' },
];

/** Three Address Code viewer -- PRD.md Section 8, SystemDesign.md Section 4.2. */
export function TACViewer() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const tac = useMemo(() => result?.tac ?? [], [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        Three Address Code will appear here after you compile.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={tac}
      emptyMessage="No intermediate code generated -- compilation didn't reach this phase."
    />
  );
}
