'use client'

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { searchableRoutes } from '@/routes/routeConfig';
import useClickOutside from '@/hooks/useClickOutside';

export default function GlobalSearch() {
  const { role } = useAuth();
  const router = useRouter();
  const wrapRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useClickOutside(wrapRef, () => setOpen(false), open);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return searchableRoutes(role)
      .filter((r) => {
        const hay = `${r.title} ${r.module} ${r.desc}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 8);
  }, [query, role]);

  const go = (route) => {
    router.push(route.path);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[index]) { e.preventDefault(); go(results[index]); }
    else if (e.key === 'Escape') { setOpen(false); e.currentTarget.blur(); }
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIndex(0); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search Page"
        aria-label="Global search"
        className="h-10 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-base placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:h-9 sm:min-h-0 sm:text-sm"
      />
      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">No screens match &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul role="listbox" className="max-h-80 overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.path} role="option" aria-selected={i === index}>
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => go(r)}
                    className={cn('flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left', i === index && 'bg-brand-50')}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{r.title}</span>
                      <span className="block truncate text-xs text-slate-500">{r.module}</span>
                    </span>
                    {i === index && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


