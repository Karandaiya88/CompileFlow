import type {
  CompilationResult,
  CompilationRecord,
  GrammarDefinition,
} from '@/types/compiler';
import { mockAdapter } from './mockAdapter';

/**
 * Backend-ready service contract.
 * Source of truth: Architecture.md Section 4.2.
 *
 * v1 (current): backed by mockAdapter (simulated JSON responses).
 * v2 (future):  swap to httpAdapter hitting the real FastAPI backend
 *               (see API-spec.md). No component or hook using this
 *               service should need to change when that swap happens.
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

// Sprint 1: always mockAdapter. A VITE_USE_MOCK flag / httpAdapter swap
// arrives in v2 per Architecture.md Section 8 -- not built prematurely here.
export const compilerService: CompilerService = mockAdapter;
