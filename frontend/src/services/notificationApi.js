import { createMockStore } from './api';
import { notificationsSeed } from './mock/notifications';

const store = createMockStore(notificationsSeed, { idPrefix: 'NT' });

/** Notifications visible to a role (mock). The backend will decide recipients per event. */
export async function getNotifications(role) {
  const all = await store.list();
  return all.filter((n) => n.roles.includes(role)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const markNotificationRead = (id) => store.update(id, { read: true });

export async function markAllNotificationsRead(ids) {
  await Promise.all(ids.map((id) => store.update(id, { read: true })));
  return { ok: true };
}
