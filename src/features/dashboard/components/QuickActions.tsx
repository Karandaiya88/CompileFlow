import { Link } from 'react-router-dom';
import { Plus, Code2, BookMarked } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface QuickAction {
  label: string;
  to: string;
  icon: typeof Plus;
  primary?: boolean;
}

const ACTIONS: QuickAction[] = [
  { label: 'New Project', to: '/projects', icon: Plus, primary: true },
  { label: 'Open Compiler Workspace', to: '/workspace', icon: Code2 },
  { label: 'Browse Grammar Library', to: '/grammar-library', icon: BookMarked },
];

export function QuickActions() {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {ACTIONS.map(({ label, to, icon: Icon, primary }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
              primary
                ? 'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]'
                : 'border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-raised)] hover:text-[var(--color-text-primary)]',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
