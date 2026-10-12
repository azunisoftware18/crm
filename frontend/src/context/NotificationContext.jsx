'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/notificationApi';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!role) {
      setItems([]);
      return undefined;
    }
    setLoading(true);
    getNotifications(role)
      .then((data) => !cancelled && setItems(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [role]);

  const markRead = useCallback(async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markNotificationRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    const unreadIds = items.filter((n) => !n.read).map((n) => n.id);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(unreadIds);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      loading,
      unreadCount: items.filter((n) => !n.read).length,
      actionRequired: items.filter((n) => n.actionRequired),
      markRead,
      markAllRead,
    }),
    [items, loading, markRead, markAllRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}


