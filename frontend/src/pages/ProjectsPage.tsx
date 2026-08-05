import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Plus, FolderKanban, Pencil, Trash2, Code2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useProjectsStore } from '@/features/projects/store/projectsStore';

export function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const renameProject = useProjectsStore((s) => s.renameProject);
  const removeProject = useProjectsStore((s) => s.removeProject);

  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    addProject(name);
    setNewName('');
  }

  function startRename(id: string, currentName: string) {
    setRenamingId(id);
    setRenameValue(currentName);
  }

  function confirmRename(id: string) {
    const name = renameValue.trim();
    if (name) renameProject(id, name);
    setRenamingId(null);
  }

  return (
    <>
      <PageHeader title="Projects" description="Manage your compiler projects." />

      <Card className="mb-4 flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="New project name..."
          className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-3 py-2 text-sm outline-none placeholder:text-[var(--color-text-disabled)] focus:border-[var(--color-accent-primary)]"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-primary-hover)]"
        >
          <Plus size={16} />
          New Project
        </button>
      </Card>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-16 text-center">
          <FolderKanban size={24} className="text-[var(--color-text-disabled)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            No projects yet -- create one above to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FolderKanban size={16} className="shrink-0 text-[var(--color-accent-primary)]" />
                  {renamingId === project.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmRename(project.id)}
                      onBlur={() => confirmRename(project.id)}
                      className="w-full rounded-[var(--radius-sm)] border border-[var(--color-accent-primary)] bg-[var(--color-bg-base)] px-1.5 py-0.5 text-sm outline-none"
                    />
                  ) : (
                    <p className="truncate text-sm font-medium">{project.name}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startRename(project.id, project.name)}
                    aria-label="Rename project"
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    aria-label="Delete project"
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)]">
                Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </p>

              <Link
                to="/workspace"
                className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-raised)] hover:text-[var(--color-text-primary)]"
              >
                <Code2 size={14} />
                Open in Workspace
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
