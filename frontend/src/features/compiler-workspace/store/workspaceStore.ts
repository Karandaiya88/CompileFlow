import { create } from 'zustand';
import type { CompilationResult } from '@/types/compiler';

export type CompileStatus = 'idle' | 'compiling' | 'done' | 'error';

interface WorkspaceState {
  sourceCode: string;
  status: CompileStatus;
  result: CompilationResult | null;
  errorMessage: string | null;
  activeTab:
    | 'pipeline'
    | 'tokens'
    | 'symbols'
    | 'parseTree'
    | 'semanticReport'
    | 'tac'
    | 'optimization'
    | 'assembly'
    | 'console'
    | 'diagnostics';

  setSourceCode: (code: string) => void;
  setActiveTab: (tab: WorkspaceState['activeTab']) => void;
  startCompiling: () => void;
  compileSucceeded: (result: CompilationResult) => void;
  compileFailed: (message: string) => void;
}

const DEFAULT_SOURCE = `int main() {
  int x = 5;
  return x + 2;
}`;

/**
 * Workspace/pipeline state -- Architecture.md Section 5: Zustand for
 * cross-component, frequently-updated state (avoids prop drilling between
 * the editor, pipeline stepper, and output panels).
 */
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  sourceCode: DEFAULT_SOURCE,
  status: 'idle',
  result: null,
  errorMessage: null,
  activeTab: 'pipeline',

  setSourceCode: (code) => set({ sourceCode: code }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  startCompiling: () => set({ status: 'compiling', errorMessage: null }),
  compileSucceeded: (result) => set({ status: 'done', result, errorMessage: null }),
  compileFailed: (message) => set({ status: 'error', errorMessage: message, result: null }),
}));
