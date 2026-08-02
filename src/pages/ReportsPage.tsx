import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Aggregate insights across your compilations." />
      <ComingSoon feature="Reports and aggregate analytics" sprint="Sprint 8" />
    </>
  );
}
