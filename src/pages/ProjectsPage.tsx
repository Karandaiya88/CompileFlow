import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" description="Manage your compiler projects." />
      <ComingSoon feature="Project creation, listing, and management" sprint="Sprint 8" />
    </>
  );
}
