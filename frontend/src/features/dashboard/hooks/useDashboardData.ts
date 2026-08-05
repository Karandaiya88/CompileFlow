import { useEffect, useState } from 'react';
import type { DashboardData } from '../types';
import { getDashboardData } from '../dashboardService';

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData };

/**
 * Per Rules.md Section 4.1: every async operation must explicitly handle
 * loading, error, and success states -- no silent failures.
 */
export function useDashboardData(): DashboardState {
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    getDashboardData()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load dashboard data.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
