import { usePathname } from 'next/navigation';
import { findRoute } from '@/routes/routeConfig';

export default function useBreadcrumbs() {
  const pathname = usePathname();
  const route = findRoute(pathname);
  if (!route || route.path === '/') return [{ label: 'Dashboard' }];
  const items = [{ label: 'Home', to: '/' }];
  if (route.module && route.module !== 'Home') items.push({ label: route.module });
  items.push({ label: route.title });
  return items;
}
