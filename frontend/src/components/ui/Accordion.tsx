import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AccordionItemProps {
  question: string;
  children: ReactNode;
}

function AccordionItem({ question, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border-subtle)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-[var(--color-text-secondary)] transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[var(--color-text-secondary)]">{children}</div>
      )}
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

Accordion.Item = AccordionItem;
