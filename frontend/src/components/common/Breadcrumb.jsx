import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-1.5">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-700">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link href={item.to} className="hover:text-brand-700">{item.label}</Link>
              ) : (
                <span className={last ? 'font-medium text-slate-900' : undefined} aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && <ChevronRight className="h-3 w-3 text-slate-500" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


