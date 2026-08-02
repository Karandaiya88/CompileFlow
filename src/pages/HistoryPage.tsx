import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function HistoryPage() {
  return (
    <>
      <PageHeader title="Compilation History" description="Review past compilation runs." />
      <ComingSoon feature="Compilation history list and filters" sprint="Sprint 8" />
    </>
  );
}
