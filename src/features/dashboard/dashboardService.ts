import type { DashboardData } from './types';
import { dashboardStats } from './mocks/dashboardStats';

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Dashboard data-access layer -- mirrors the adapter pattern used by
 * compilerService (Architecture.md Section 4.2). Components never import
 * the mock fixture directly; they go through this function so a real
 * `/dashboard/stats` endpoint can replace it later without touching UI.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return delay(dashboardStats);
}
