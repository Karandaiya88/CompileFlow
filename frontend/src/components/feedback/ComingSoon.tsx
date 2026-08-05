import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ComingSoonProps {
  feature: string;
  sprint: string;
}

/**
 * Placeholder for routes whose real feature work is scheduled in a
 * later sprint (see Phases.md). Keeps Sprint 1 honest: routing and
 * layout exist for every page, but feature content isn't faked as
 * "done" ahead of its actual sprint.
 */
export function ComingSoon({ feature, sprint }: ComingSoonProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Badge tone="info">{sprint}</Badge>
      <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
        {feature} will be built in {sprint}, per Phases.md. This route and
        layout are wired up now so navigation is fully functional in Sprint 1.
      </p>
    </Card>
  );
}
