import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'tight' | 'default' | 'none';
}

/**
 * Base surface for all panels/cards -- Design.md Section 7.
 * radius-lg, shadow-panel, border-subtle. Never floats without a border.
 */
export function Card({ padding = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-panel)]',
        padding === 'default' && 'p-4',
        padding === 'tight' && 'p-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
