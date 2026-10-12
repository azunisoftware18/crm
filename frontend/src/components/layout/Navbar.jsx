'use client'

import { Menu } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';

export default function Navbar({ onOpenMobileMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/95 px-2.5 backdrop-blur-md sm:gap-3 sm:px-4 lg:px-6">
      <button type="button" onClick={onOpenMobileMenu} aria-label="Open navigation menu" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-1 items-center"><GlobalSearch /></div>
      <NotificationBell />
      <UserMenu />
    </header>
  );
}


