import type {
  CompilationRecord,
  CompilationResult,
  GrammarDefinition,
} from '@/types/compiler';
import type { CompilerService, CompileOptions } from './compilerService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Distinct error type for the real backend adapter -- same rationale as
 * MockAdapterError (Rules.md Section 4.5): a network/HTTP failure should
 * be visibly distinguishable from a compilation-logic error while
 * debugging.
 */
export class HttpAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpAdapterError';
  }
}

interface BackendErrorBody {
  detail?: string;
  error?: { message?: string };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    // fetch() itself throws (before any HTTP response exists) when the
    // server is unreachable -- DNS failure, connection refused, CORS
    // block, etc. This is categorically different from a 4xx/5xx and
    // deserves a message pointing at the actual likely cause.
    throw new HttpAdapterError(
      `Could not reach the SmartCC backend at ${BASE_URL}. Is it running? (uvicorn app.main:app --port 8000)`,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body: BackendErrorBody = await response.json();
      message = body.detail ?? body.error?.message ?? message;
    } catch {
      // Response body wasn't JSON (or was empty) -- fall back to the
      // generic status-based message above rather than throwing here.
    }
    throw new HttpAdapterError(message);
  }

  return response.json();
}

interface HistoryResponse {
  total: number;
  items: CompilationRecord[];
}

/**
 * Real backend adapter -- API-spec.md's contract, implemented against
 * the FastAPI server built in Sprints 9-14. Same CompilerService
 * interface as mockAdapter (Architecture.md Section 4.2): swapping
 * compilerService.ts to use this instead of mockAdapter requires zero
 * changes to any component or hook.
 */
export const httpAdapter: CompilerService = {
  compile(source: string, options?: CompileOptions) {
    return request<CompilationResult>('/compile', {
      method: 'POST',
      body: JSON.stringify({ source, options }),
    });
  },

  getGrammar(id: string) {
    return request<GrammarDefinition>(`/grammar/${encodeURIComponent(id)}`);
  },

  async getHistory(projectId: string) {
    const { items } = await request<HistoryResponse>(
      `/history/${encodeURIComponent(projectId)}`,
    );
    return items;
  },
};
