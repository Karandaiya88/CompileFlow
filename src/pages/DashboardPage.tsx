import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState } from '@/components/feedback/AsyncState';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { RecentProjectsCard } from '@/features/dashboard/components/RecentProjectsCard';
import { RecentCompilationsCard } from '@/features/dashboard/components/RecentCompilationsCard';
import { PipelineStatusCard } from '@/features/dashboard/components/PipelineStatusCard';
import { CompilerMetricsChart } from '@/features/dashboard/components/CompilerMetricsChart';
import { CompilationTrendChart } from '@/features/dashboard/components/CompilationTrendChart';
import { QuickActions } from '@/features/dashboard/components/QuickActions';

export function DashboardPage() {
  const state = useDashboardData();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your compilation activity, project stats, and pipeline health at a glance."
      />

      {state.status === 'loading' && <LoadingState label="Loading dashboard data" />}
      {state.status === 'error' && <ErrorState message={state.message} />}

      {state.status === 'success' && (
        <div className="flex flex-col gap-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {state.data.stats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </div>

          {/* Recent Projects + Recent Compilations */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentProjectsCard projects={state.data.recentProjects} />
            <RecentCompilationsCard
              compilations={state.data.recentCompilations}
              projects={state.data.recentProjects}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CompilationTrendChart trend={state.data.compilationTrend} />
            <CompilerMetricsChart phaseMetrics={state.data.phaseMetrics} />
          </div>

          {/* Pipeline Status + Quick Actions */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PipelineStatusCard phaseMetrics={state.data.phaseMetrics} />
            <QuickActions />
          </div>
        </div>
      )}
    </>
  );
}
