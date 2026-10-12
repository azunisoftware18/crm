'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const COLLAPSE_KEY = 'sne.sidebarCollapsed'

export default function AppLayout({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpenPath, setMobileOpenPath] = useState('')
  const mobileOpen = Boolean(pathname && mobileOpenPath === pathname)

  useEffect(() => { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); }, [collapsed]);

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onCloseMobile={() => setMobileOpenPath('')}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileMenu={() => setMobileOpenPath(pathname || '')} />
        <main className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto w-full max-w-[1440px] animate-fade-in px-3 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-slate-900 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


