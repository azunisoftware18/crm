import { createMockStore } from './api';
import { leadsSeed } from './mock/leads';
import { customersSeed } from './mock/customers';

const leads = createMockStore(leadsSeed, { idPrefix: 'LD' });
const customers = createMockStore(customersSeed, { idPrefix: 'CUS' });
const followUps = createMockStore([], { idPrefix: 'FU' });
const activities = createMockStore([], { idPrefix: 'ACT' });

// Replace each with the matching http.get/post/put/delete call, e.g. http.get('/crm/leads', { params }).
export const { list: getLeads, get: getLead, create: createLead, update: updateLead, remove: deleteLead } = leads;
export const { list: getCustomers, get: getCustomer, create: createCustomer, update: updateCustomer, remove: deleteCustomer } = customers;
export const { list: getFollowUps, create: createFollowUp, update: updateFollowUp } = followUps;
export const { list: getActivities, create: createActivity } = activities;
