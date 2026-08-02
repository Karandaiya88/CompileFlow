import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { cn } from '@/lib/cn';

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  emptyMessage?: string;
}

/**
 * Shared table primitive -- Architecture.md Section 3 (components/data-table),
 * built once on TanStack Table so Token Viewer, Symbol Table, and future
 * panels (History, Reports) don't each reimplement table logic.
 * Data cells default to monospace per Design.md Section 7.
 */
export function DataTable<T>({ columns, data, emptyMessage = 'No data.' }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return <p className="p-3 text-sm text-[var(--color-text-secondary)]">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-left font-mono text-xs">
        <thead className="sticky top-0 bg-[var(--color-bg-surface)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-[var(--color-border-subtle)] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-[var(--color-border-subtle)]',
                i % 2 === 1 && 'bg-[var(--color-bg-surface-raised)]/40',
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-1.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
