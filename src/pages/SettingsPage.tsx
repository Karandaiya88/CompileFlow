import { PageHeader } from '@/components/ui/PageHeader';
import { ComingSoon } from '@/components/feedback/ComingSoon';

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Configure your SmartCC preferences." />
      <ComingSoon feature="Theme, editor, and account settings" sprint="Sprint 8" />
    </>
  );
}
