import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, TerminalSquare } from 'lucide-react';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS, type NavItem } from './navigation';
import { cn } from '@/lib/cn';

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[var(--color-accent-primary)] text-white'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-raised)] hover:text-[var(--color-text-primary)]',
        )
      }
    >
      <Icon size={18} strokeWidth={2} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

/**
 * Primary app sidebar. Collapsible (not resizable-by-drag in Sprint 1 --
 * the Compiler Workspace's own internal panels get drag-resize per
 * PRD.md Section 8; this is a simple collapse toggle for the nav rail).
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-full flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]"
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <TerminalSquare size={22} className="shrink-0 text-[var(--color-accent-primary)]" />
        {!collapsed && (
          <span className="font-mono text-sm font-semibold tracking-tight">SmartCC</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavRow key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[var(--color-border-subtle)] px-2 py-2">
        {SECONDARY_NAV_ITEMS.map((item) => (
          <NavRow key={item.path} item={item} collapsed={collapsed} />
        ))}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-raised)] hover:text-[var(--color-text-primary)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
