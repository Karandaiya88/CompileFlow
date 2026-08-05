import { create } from 'zustand';
import type { Project } from '@/types/compiler';

interface ProjectsState {
  projects: Project[];
  addProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  removeProject: (id: string) => void;
}

const now = () => new Date().toISOString();

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_42',
    name: 'Arithmetic Expressions Lab',
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-20T10:15:00Z',
    language: 'c-like',
  },
  {
    id: 'proj_43',
    name: 'Control Flow Assignment',
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-07-18T14:30:00Z',
    language: 'c-like',
  },
  {
    id: 'proj_44',
    name: 'Function Declarations Practice',
    createdAt: '2026-07-19T09:00:00Z',
    updatedAt: '2026-07-19T09:00:00Z',
    language: 'c-like',
  },
];

/**
 * Projects state -- local/in-memory only for v1. Real Project CRUD against
 * a backend is v3 scope (API-spec.md Section 6); this store is intentionally
 * simple (no persistence across reloads) since that's an honest reflection
 * of what "frontend only, mock data" (PRD.md Section 12) means for a
 * feature that will eventually need a database.
 */
export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: INITIAL_PROJECTS,

  addProject: (name) =>
    set((state) => ({
      projects: [
        {
          id: `proj_${Math.random().toString(36).slice(2, 8)}`,
          name,
          createdAt: now(),
          updatedAt: now(),
          language: 'c-like',
        },
        ...state.projects,
      ],
    })),

  renameProject: (id, name) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, name, updatedAt: now() } : p)),
    })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}));
