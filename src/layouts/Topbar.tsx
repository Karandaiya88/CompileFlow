import { Bell, Search } from 'lucide-react';

/**
 * App-wide top bar. Sprint 1: static shell only -- search and
 * notifications are wired up to real state in later sprints.
 */
export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-6">
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
        <Search size={16} />
        <span>Search projects, compilations...</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Bell size={18} />
        </button>
        <div className="h-8 w-8 rounded-full bg-[var(--color-accent-primary)] text-center text-sm font-semibold leading-8 text-white">
          K
        </div>
      </div>
    </header>
  );
}
