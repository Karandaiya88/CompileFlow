import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="Documentation and guidance for using SmartCC." />
      <ComingSoon feature="Help center and documentation" sprint="Sprint 8" />
    </>
  );
}
