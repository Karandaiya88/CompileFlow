import { FileCode2 } from 'lucide-react';

/**
 * Resizable sidebar (file/project navigation) -- PRD.md Section 8.
 * Sprint 3: single mock file, since project/file CRUD is Sprint 8 scope
 * (SystemDesign.md Section 4.2). Structure is real; content is minimal.
 */
export function WorkspaceSidebar() {
  return (
    <div className="flex h-full flex-col p-2">
      <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
        Files
      </p>
      <button
        type="button"
        className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-bg-surface-raised)] px-2 py-1.5 text-left text-sm text-[var(--color-text-primary)]"
      >
        <FileCode2 size={15} className="shrink-0 text-[var(--color-accent-primary)]" />
        main.sc
      </button>
    </div>
  );
}
