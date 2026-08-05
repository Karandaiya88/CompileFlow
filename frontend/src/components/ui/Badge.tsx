import type { HTMLAttributes } from 'react';
import type { CompilerPhase } from '@/types/compiler';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | CompilerPhase;

const TONE_STYLES: Record<BadgeTone, string> = {
  default: 'bg-[var(--color-bg-surface-raised)] text-[var(--color-text-secondary)]',
  success: 'bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)]',
  warning: 'bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] text-[var(--color-warning)]',
  error: 'bg-[color-mix(in_srgb,var(--color-error)_15%,transparent)] text-[var(--color-error)]',
  info: 'bg-[color-mix(in_srgb,var(--color-info)_15%,transparent)] text-[var(--color-info)]',
  lexical: 'bg-[color-mix(in_srgb,var(--color-phase-lexical)_15%,transparent)] text-[var(--color-phase-lexical)]',
  syntax: 'bg-[color-mix(in_srgb,var(--color-phase-syntax)_15%,transparent)] text-[var(--color-phase-syntax)]',
  semantic: 'bg-[color-mix(in_srgb,var(--color-phase-semantic)_15%,transparent)] text-[var(--color-phase-semantic)]',
  intermediate: 'bg-[color-mix(in_srgb,var(--color-phase-ir)_15%,transparent)] text-[var(--color-phase-ir)]',
  optimization: 'bg-[color-mix(in_srgb,var(--color-phase-opt)_15%,transparent)] text-[var(--color-phase-opt)]',
  codegen: 'bg-[color-mix(in_srgb,var(--color-phase-codegen)_15%,transparent)] text-[var(--color-phase-codegen)]',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/**
 * Pill-shaped badge -- Design.md Section 7.
 * Phase colors are never the only differentiator: always paired with the
 * text label passed as children (accessibility requirement, Design.md 8).
 */
export function Badge({ tone = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium',
        TONE_STYLES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
