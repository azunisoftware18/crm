'use client'

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

const PAGE_SIZES = [10, 20, 50];

export default function DataTable({ columns, data, rowKey, loading, emptyTitle, emptyDescription, actions, toolbar }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return typeof value === 'string' && value.toLowerCase().includes(q);
      }),
    );
  }, [data, query, columns]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (col?.type === 'number') return (Number(av) - Number(bv)) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const onSort = (key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    setPage(0);
  };

  const onQuery = (value) => {
    setQuery(value);
    setPage(0);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search records..."
            className="h-10 min-h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-base placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:h-9 sm:min-h-0 sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {toolbar}
        </div>
      </div>

      <div className="scroll-thin overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn('px-5 py-3 font-semibold', col.align === 'right' && 'text-right')}>
                  {col.sortable !== false ? (
                    <button type="button" onClick={() => onSort(col.key)} className="inline-flex items-center gap-1 hover:text-slate-700">
                      {col.label}
                      {sort.key === col.key ? (sort.dir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />) : null}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {actions && <th className="px-5 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-10 text-center text-sm text-slate-500">Loading...</td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-10 text-center">
                  <div className="mx-auto max-w-sm">
                    <p className="text-sm font-medium text-slate-900">{emptyTitle || 'No records'}</p>
                    {emptyDescription && <p className="mt-1 text-xs text-slate-500">{emptyDescription}</p>}
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((row) => (
                <tr key={rowKey ? row[rowKey] : row.id} className="transition-colors hover:bg-slate-50/60">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-3', col.align === 'right' && 'text-right')}>
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length} records
          </p>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:h-8 sm:text-xs"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg px-2 py-1 text-xs disabled:cursor-not-allowed disabled:text-slate-400 hover:bg-slate-100">Prev</button>
              <span className="text-xs text-slate-500">Page {page + 1} of {pageCount}</span>
              <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((p) => p + 1)} className="rounded-lg px-2 py-1 text-xs disabled:cursor-not-allowed disabled:text-slate-400 hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


