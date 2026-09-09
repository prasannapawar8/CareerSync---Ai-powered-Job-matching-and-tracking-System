'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, LayoutDashboard, LogOut, Menu, Puzzle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import ThemeToggle from './ThemeToggle';
import { Logo, LogoMark } from './Logo';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const PRIMARY_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Job matches', icon: Briefcase },
];

const SETUP_NAV: NavItem[] = [
  { href: '/dashboard#resume', label: 'Resume', icon: FileText },
  { href: '/dashboard#clipper', label: 'Web clipper', icon: Puzzle },
];

function initialsFor(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0] || 'U';
  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-primary-soft font-medium text-primary'
          : 'text-muted hover:bg-surface-muted hover:text-foreground',
      )}
    >
      {active && <span className="absolute left-0 h-5 w-0.5 -translate-x-2 rounded-full bg-primary" />}
      <Icon className={cn('size-[18px] shrink-0', active ? 'text-primary' : 'text-subtle group-hover:text-foreground')} />
      {item.label}
    </Link>
  );
}

function SidebarContent({
  user,
  signOutAction,
  pathname,
  onNavigate,
}: {
  user: { name?: string | null; email?: string | null };
  signOutAction: () => Promise<void>;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-subtle">Workspace</p>
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-subtle">Setup</p>
          {SETUP_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={false} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-semibold text-foreground">
            {initialsFor(user.name, user.email)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name ?? 'Your account'}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-danger-surface hover:text-danger"
          >
            <LogOut className="size-[18px]" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AppShell({
  user,
  signOutAction,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer links close it via onNavigate, so no route-change effect is needed.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const currentTitle =
    PRIMARY_NAV.find((item) => item.href === pathname)?.label ?? 'Workspace';

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface lg:block">
        <SidebarContent user={user} signOutAction={signOutAction} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface elevation-lg animate-fade-in">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <SidebarContent
              user={user}
              signOutAction={signOutAction}
              pathname={pathname}
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border glass px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-muted hover:text-foreground"
            >
              <Menu className="size-[18px]" />
            </button>
            <span className="flex items-center gap-2 font-semibold tracking-tight">
              <LogoMark className="size-8" />
              <span className="text-sm">{currentTitle}</span>
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Desktop utility bar */}
        <div className="sticky top-0 z-40 hidden h-16 items-center justify-end gap-2 border-b border-border glass px-8 lg:flex">
          <ThemeToggle />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
