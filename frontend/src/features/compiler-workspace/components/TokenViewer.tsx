import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { Badge } from '@/components/ui/Badge';
import type { Token, TokenType } from '@/types/compiler';
import { useWorkspaceStore } from '../store/workspaceStore';

/**
 * Token-type color mapping, deliberately reusing the same hues as the
 * CodeEditor's Monaco theme (Design.md Section 7) so a token's color here
 * matches how it's highlighted in the editor.
 */
const TOKEN_TYPE_STYLE: Record<TokenType, string> = {
  KEYWORD: 'text-[var(--color-phase-syntax)]',
  IDENTIFIER: 'text-[var(--color-text-primary)]',
  OPERATOR: 'text-[var(--color-warning)]',
  LITERAL: 'text-[var(--color-phase-lexical)]',
  PUNCTUATION: 'text-[var(--color-text-secondary)]',
  COMMENT: 'text-[var(--color-text-disabled)] italic',
};

const columns: ColumnDef<Token, unknown>[] = [
  {
    header: '#',
    accessorKey: 'id',
    cell: (ctx) => <span className="text-[var(--color-text-disabled)]">{ctx.row.index + 1}</span>,
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: (ctx) => <Badge tone="default">{ctx.getValue<TokenType>()}</Badge>,
  },
  {
    header: 'Value',
    accessorKey: 'value',
    cell: (ctx) => (
      <span className={TOKEN_TYPE_STYLE[ctx.row.original.type]}>{ctx.getValue<string>()}</span>
    ),
  },
  {
    header: 'Line',
    accessorKey: 'line',
  },
  {
    header: 'Column',
    accessorKey: 'column',
  },
];

/** Token Viewer -- PRD.md Section 8, SystemDesign.md Section 4.2. */
export function TokenViewer() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);
  const tokens = useMemo(() => result?.tokens ?? [], [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        Tokens will appear here after you compile.
      </p>
    );
  }

  return <DataTable columns={columns} data={tokens} emptyMessage="No tokens produced." />;
}
