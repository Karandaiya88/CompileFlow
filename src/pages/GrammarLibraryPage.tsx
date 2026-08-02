import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function GrammarLibraryPage() {
  return (
    <>
      <PageHeader title="Grammar Library" description="Explore the supported C-like grammar." />
      <ComingSoon feature="Grammar rule browser and sample programs" sprint="Sprint 8" />
    </>
  );
}
