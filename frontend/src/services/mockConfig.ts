/**
 * Small mutable config read by mockAdapter.ts, written by the Settings
 * page's store. Kept as a plain module (not part of the Zustand store
 * itself) so services/ doesn't need to import from features/settings/,
 * preserving the one-way dependency direction in Architecture.md Section 3
 * (features -> services, never services -> features).
 */
export const mockConfig = {
  compileDelayMs: 600,
};
