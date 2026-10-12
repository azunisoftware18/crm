import { createMockStore } from './api';
import { usersSeed } from './mock/users';

const users = createMockStore(usersSeed, { idPrefix: 'USR' });
const auditLogs = createMockStore([], { idPrefix: 'AUD' });

export const { list: getUsers, get: getUser, create: createUser, update: updateUser } = users;
export const { list: getAuditLogs } = auditLogs;
