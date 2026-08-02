import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <p className="font-mono text-6xl font-bold text-[var(--color-border-strong)]">404</p>
      <p className="text-[var(--color-text-secondary)]">This page doesn't exist.</p>
      <Link
        to="/"
        className="rounded-[var(--radius-md)] bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-primary-hover)]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
