import { daysFromNow } from './helpers';

/** Demo accounts, one per role. Fictional people, demo only. */
export const usersSeed = [
  { id: 'USR-0001', name: 'Aarav Mehta', email: 'sales@sne.local', phone: '+91 90000 00001', role: 'sales', department: 'Sales', status: 'Active', lastLogin: daysFromNow(-1) },
  { id: 'USR-0002', name: 'Kavita Sharma', email: 'manager@sne.local', phone: '+91 90000 00002', role: 'manager', department: 'Management', status: 'Active', lastLogin: daysFromNow(0) },
  { id: 'USR-0003', name: 'Rohit Jain', email: 'purchase@sne.local', phone: '+91 90000 00003', role: 'purchase', department: 'Purchase', status: 'Active', lastLogin: daysFromNow(-2) },
  { id: 'USR-0004', name: 'Suresh Patel', email: 'plant@sne.local', phone: '+91 90000 00004', role: 'plant', department: 'Plant', status: 'Active', lastLogin: daysFromNow(-1) },
  { id: 'USR-0005', name: 'Neha Agarwal', email: 'accounts@sne.local', phone: '+91 90000 00005', role: 'accounts', department: 'Accounts', status: 'Active', lastLogin: daysFromNow(-3) },
  { id: 'USR-0006', name: 'Imran Khan', email: 'dispatch@sne.local', phone: '+91 90000 00006', role: 'dispatch', department: 'Dispatch', status: 'Active', lastLogin: daysFromNow(-1) },
  { id: 'USR-0007', name: 'Priya Singh', email: 'admin@sne.local', phone: '+91 90000 00007', role: 'admin', department: 'IT', status: 'Active', lastLogin: daysFromNow(0) },
];
