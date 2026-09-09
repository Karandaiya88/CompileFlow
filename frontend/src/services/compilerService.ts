import type {
  CompilationResult,
  CompilationRecord,
  GrammarDefinition,
} from '@/types/compiler';
import { mockAdapter } from './mockAdapter';
import { httpAdapter } from './httpAdapter';

/**
 * Backend-ready service contract.
 * Source of truth: Architecture.md Section 4.2.
 *
 * v1: backed by mockAdapter (simulated JSON responses).
 * v2 (Sprint 15): httpAdapter now exists and hits the real FastAPI
 * backend (API-spec.md). The switch below reads VITE_USE_MOCK so both
 * remain available -- default stays mock so `npm run dev` keeps working
 * standalone with no backend running, per the v1 quick-start promise in
 * the README. Set VITE_USE_MOCK=false to exercise the real backend.
 */
export interface CompileOptions {
  targetOptimizations?: string[];
  stopAtPhase?: string | null;
}

export interface CompilerService {
  compile(source: string, options?: CompileOptions): Promise<CompilationResult>;
  getGrammar(id: string): Promise<GrammarDefinition>;
  getHistory(projectId: string): Promise<CompilationRecord[]>;
}

const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

/** Exposed so UI (e.g. Settings) can honestly reflect which adapter is
 * active, rather than showing mock-only controls as if they always apply. */
export const isMockMode = useMock;

export const compilerService: CompilerService = useMock ? mockAdapter : httpAdapter;
