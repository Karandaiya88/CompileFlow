import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { Badge } from '@/components/ui/Badge';
import type { SymbolEntry } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

const columns: ColumnDef<SymbolEntry, unknown>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (ctx) => (
      <span className="font-semibold text-[var(--color-text-primary)]">
        {ctx.getValue<string>()}
      </span>
    ),
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: (ctx) => <Badge tone="semantic">{ctx.getValue<string>()}</Badge>,
  },
  {
    header: 'Scope',
    accessorKey: 'scope',
  },
  {
    header: 'Declared At',
    accessorKey: 'declaredAt',
    cell: (ctx) => `Line ${ctx.getValue<number>()}`,
  },
];

/** Symbol Table -- PRD.md Section 8, SystemDesign.md Section 4.2. */
export function SymbolTableView() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const symbols = useMemo(() => result?.symbolTable ?? [], [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        The symbol table will appear here after you compile.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={symbols}
      emptyMessage={
        result?.status === 'failed'
          ? 'No symbols recorded -- compilation failed before/during semantic analysis.'
          : 'No symbols declared in this program.'
      }
    />
  );
}
