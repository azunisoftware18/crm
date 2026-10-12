import { hoursAgo } from './helpers'

const PREVIEW_ROLES = ['sales', 'manager', 'purchase', 'plant', 'accounts', 'dispatch', 'admin']

/** One action item and one information item for the local dashboard preview. */
export const notificationsSeed = [
  {
    id: 'NT-1',
    type: 'task',
    title: 'Sample action item',
    message: 'This is the only action item in the dashboard preview.',
    linkedRecord: 'SAMPLE-001',
    link: '/tasks',
    actionRequired: true,
    responsible: 'Preview only',
    dueDate: null,
    priority: 'Low',
    createdAt: hoursAgo(1),
    read: false,
    roles: PREVIEW_ROLES,
  },
  {
    id: 'NT-2',
    type: 'task',
    title: 'Sample information update',
    message: 'This is the only information item in the dashboard preview.',
    linkedRecord: 'SAMPLE-002',
    link: '/dashboard',
    actionRequired: false,
    responsible: 'Preview only',
    dueDate: null,
    priority: 'Low',
    createdAt: hoursAgo(2),
    read: true,
    roles: PREVIEW_ROLES,
  },
]
