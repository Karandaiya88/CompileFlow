import { create } from 'zustand';
import { mockConfig } from '@/services/mockConfig';

interface SettingsState {
  editorFontSize: number;
  compileDelayMs: number;
  setEditorFontSize: (size: number) => void;
  setCompileDelayMs: (ms: number) => void;
}

/**
 * Settings are local-only for v1 (no account/backend to persist to yet --
 * Security.md Section 3 v1-v2 has no auth). Editor font size is read
 * directly by CodeEditor; compileDelayMs writes through to mockConfig so
 * the Workspace's simulated compile latency actually reflects this
 * setting, rather than a settings control that visibly does nothing.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  editorFontSize: 13,
  compileDelayMs: mockConfig.compileDelayMs,

  setEditorFontSize: (size) => set({ editorFontSize: size }),
  setCompileDelayMs: (ms) => {
    mockConfig.compileDelayMs = ms;
    set({ compileDelayMs: ms });
  },
}));
