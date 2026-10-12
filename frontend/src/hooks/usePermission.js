import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { can } from '@/config/roles';
import { canAccessPath } from '@/routes/routeConfig';

/** UI-level permission helper. Not a security boundary: the backend must enforce the same rules. */
export default function usePermission() {
  const { role } = useAuth();
  return {
    role,
    can: useCallback((action) => can(role, action), [role]),
    canAccess: useCallback((path) => canAccessPath(role, path), [role]),
  };
}
