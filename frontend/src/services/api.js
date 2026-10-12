import axios from 'axios';

/** Set NEXT_PUBLIC_USE_MOCK=false when a data backend is configured. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 15000,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.replace('/login');
    }
    return Promise.reject(err);
  },
);

export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockResponse(data, ms) {
  await delay(ms);
  return structuredClone(data);
}

/**
 * Generic in-memory store used until real endpoints exist.
 * list(params): `search` matches any string field; every other non-empty param must equal the field.
 */
export function createMockStore(seed = [], { idPrefix = 'ID' } = {}) {
  let rows = structuredClone(seed);
  let counter = rows.length;
  const nextId = () => {
    counter += 1;
    return `${idPrefix}-${String(counter).padStart(4, '0')}`;
  };

  return {
    async list(params = {}) {
      await delay();
      const { search, ...filters } = params;
      let out = rows;
      if (search) {
        const q = String(search).toLowerCase();
        out = out.filter((r) => Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)));
      }
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'all') out = out.filter((r) => r[k] === v);
      });
      return structuredClone(out);
    },
    async get(id) {
      await delay(150);
      const row = rows.find((r) => r.id === id);
      if (!row) throw new Error(`Record ${id} not found`);
      return structuredClone(row);
    },
    async create(payload) {
      await delay();
      const row = { id: nextId(), createdAt: new Date().toISOString(), ...payload };
      rows = [row, ...rows];
      return structuredClone(row);
    },
    async update(id, patch) {
      await delay();
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) throw new Error(`Record ${id} not found`);
      rows[i] = { ...rows[i], ...patch, updatedAt: new Date().toISOString() };
      return structuredClone(rows[i]);
    },
    async remove(id) {
      await delay();
      const before = rows.length;
      rows = rows.filter((r) => r.id !== id);
      if (rows.length === before) throw new Error(`Record ${id} not found`);
      return { id, deleted: true };
    },
  };
}
