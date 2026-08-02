import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FolderKanban, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Project } from '@/types/compiler';

export function RecentProjectsCard({ projects }: { projects: Project[] }) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
        <h3 className="text-sm font-semibold">Recent Projects</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>
      <ul className="divide-y divide-[var(--color-border-subtle)]">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              to="/workspace"
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-surface-raised)]"
            >
              <FolderKanban size={16} className="shrink-0 text-[var(--color-text-secondary)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
