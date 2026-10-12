'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { getVisibleNav, flattenNavPaths } from '@/config/navConfig';
import { getIcon } from '@/components/common/iconMap';
import Logo from './Logo';

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const { role } = useAuth();
  const pathname = usePathname();
  const nav = useMemo(() => getVisibleNav(role), [role]);

  const activePath = useMemo(() => {
    const matches = flattenNavPaths(nav).filter((p) => pathname === p || pathname.startsWith(`${p}/`));
    return matches.sort((a, b) => b.length - a.length)[0] || null;
  }, [nav, pathname]);

  const groupOf = (item) => item.children?.some((c) => c.path === activePath);
  const activeGroup = nav.find(groupOf);
  // null means follow the current route; a Set means the user has manually
  // chosen which sidebar groups are open.
  const [openGroups, setOpenGroups] = useState(null);

  const toggle = (label) =>
    setOpenGroups((current) => {
      const next = new Set(current ?? (activeGroup ? [activeGroup.label] : []));
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });

  const onGroupClick = (item) => {
    if (collapsed) onToggleCollapse();
    toggle(item.label);
  };

  const rail = collapsed && !mobileOpen;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white text-slate-900 transition-[width,transform] duration-200',
          'w-[85vw] max-w-[272px] lg:static lg:translate-x-0',
          rail ? 'lg:w-[72px]' : 'lg:w-[272px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Primary navigation"
      >
        <div className={cn('flex h-16 shrink-0 items-center border-b border-slate-200', rail ? 'justify-center px-0' : 'justify-between px-4')}>
          {rail ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          ) : <Logo />}
          <button type="button" onClick={onCloseMobile} aria-label="Close menu" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scroll-thin flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {nav.map((item) => {
            const Icon = getIcon(item.icon);
            if (item.path) {
              const active = item.path === activePath;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  title={rail ? item.label : undefined}
                  onClick={() => { setOpenGroups(null); onCloseMobile(); }}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    !rail && 'lg:min-h-0',
                    active ? 'bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-100' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                    rail && 'h-11 w-full justify-center px-0',
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!rail && <span className="truncate">{item.label}</span>}
                </Link>
              );
            }
            const isOpen = (openGroups === null ? activeGroup?.label === item.label : openGroups.has(item.label)) && !rail;
            const hasActive = groupOf(item);
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => onGroupClick(item)}
                  aria-expanded={isOpen}
                  title={rail ? item.label : undefined}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    !rail && 'lg:min-h-0',
                    hasActive ? 'text-brand-800' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                    rail && 'h-11 justify-center px-0',
                  )}
                >
                  <Icon className={cn('h-[18px] w-[18px] shrink-0', hasActive && 'text-brand-600')} />
                  {!rail && (
                    <>
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
                    </>
                  )}
                </button>
                {isOpen && (
                  <ul className="ml-[22px] mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                    {item.children.map((c) => {
                      const active = c.path === activePath;
                      return (
                        <li key={c.path}>
                          <Link
                            href={c.path}
                            onClick={onCloseMobile}
                            className={cn(
                              'block truncate rounded-md px-3 py-1.5 text-[13px] transition-colors',
                              active ? 'bg-brand-50 font-semibold text-brand-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            )}
                          >
                            {c.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="hidden shrink-0 border-t border-slate-200 p-3 lg:block">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>Collapse</span>
            </button>
          </div>
        )}

      </aside>
    </>
  );
}


