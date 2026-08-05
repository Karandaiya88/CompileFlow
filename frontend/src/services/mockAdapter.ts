import type {
  CompilationResult,
  CompilationRecord,
  GrammarDefinition,
} from '@/types/compiler';
import type { CompilerService, CompileOptions } from './compilerService';
import { mockConfig } from './mockConfig';
import { sampleSuccessCompilation } from '@/features/compiler-workspace/mocks/sampleSuccessCompilation';
import { sampleSemanticFailure } from '@/features/compiler-workspace/mocks/sampleSemanticFailure';
import { cLikeGrammar } from '@/features/grammar-library/cLikeGrammar';

/**
 * Distinct error type for the mock layer -- Rules.md Section 4.5:
 * "Mock adapter failures (simulated) must be distinguishable from real
 * logic errors during development."
 */
export class MockAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockAdapterError';
  }
}

function delay<T>(value: T, ms?: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms ?? mockConfig.compileDelayMs));
}

export const mockAdapter: CompilerService = {
  async compile(source: string, _options?: CompileOptions): Promise<CompilationResult> {
    if (!source.trim()) {
      throw new MockAdapterError('Source code is empty -- nothing to compile.');
    }

    // Deterministic mock routing: a source containing an undeclared-looking
    // identifier pattern returns the semantic-failure fixture; everything
    // else returns the success fixture. Real routing logic arrives with the
    // v2 backend (API-spec.md); this is intentionally simple for Sprint 1.
    if (source.includes('undeclared_demo')) {
      return delay(sampleSemanticFailure);
    }

    return delay(sampleSuccessCompilation);
  },

  async getGrammar(id: string): Promise<GrammarDefinition> {
    if (id !== cLikeGrammar.id) {
      throw new MockAdapterError(`No mock grammar registered for id "${id}".`);
    }
    return delay(cLikeGrammar, 200);
  },

  async getHistory(_projectId: string): Promise<CompilationRecord[]> {
    const history: CompilationRecord[] = [
      {
        id: 'comp_9182',
        projectId: _projectId,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'success',
        failedAtPhase: null,
      },
      {
        id: 'comp_9181',
        projectId: _projectId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        status: 'failed',
        failedAtPhase: 'semantic',
      },
    ];
    return delay(history, 300);
  },
};
