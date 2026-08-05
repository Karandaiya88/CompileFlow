import type { CompilationRecord } from '@/types/compiler';
import { historyRecords } from './mocks/historyRecords';

export interface HistoryService {
  getAll(): Promise<CompilationRecord[]>;
}

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Mock implementation for v1. The real endpoint (`GET /history/:projectId`)
 * is specified in API-spec.md Section 5 -- this service's shape is written
 * to match that contract so swapping to an httpAdapter later needs no
 * component changes, per Architecture.md Section 4.2.
 */
export const historyService: HistoryService = {
  async getAll() {
    return delay([...historyRecords].sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
  },
};
