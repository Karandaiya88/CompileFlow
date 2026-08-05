import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  BookMarked,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

/** Primary navigation -- mirrors PRD.md Section 7 functional scope. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Compiler Workspace', path: '/workspace', icon: Code2 },
  { label: 'Grammar Library', path: '/grammar-library', icon: BookMarked },
  { label: 'History', path: '/history', icon: History },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
];
