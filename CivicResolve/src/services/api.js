import { makeIncident, initialIncidentsRaw, initialNotifications, getNowTime } from '../data/mockData.js';

// Base API configuration (Vite proxy forwards /api to backend:8000)
const API_BASE = '/api/v1';

// Token storage key
const TOKEN_KEY = 'civicresolve_access_token';

// In-memory mock databases for Phase 1 (Incident persistence will connect in Phase 2)
let DB = initialIncidentsRaw.map(makeIncident);
let NT = [...initialNotifications];

const wait = (v) => new Promise((resolve) => setTimeout(() => resolve(v), 300));

/**
 * Core HTTP Request Wrapper using native fetch()
 * Automatically injects JWT Bearer token if present
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMsg =
      (data && data.detail) ||
      (typeof data === 'string' && data) ||
      'Request failed';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // ==========================================
  // TOKEN MANAGEMENT
  // ==========================================
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  // ==========================================
  // AUTHENTICATION (Real FastAPI Backend)
  // ==========================================
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data && data.access_token) {
      api.setToken(data.access_token);
    }
    return data;
  },

  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data && data.access_token) {
      api.setToken(data.access_token);
    }
    return data;
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      api.clearToken();
    }
  },

  updateProfile: async (updateData) => {
    return await request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  getFieldOfficers: async () => {
    return await request('/users/officers');
  },

  // ==========================================
  // INCIDENTS & NOTIFICATIONS (Mock for Phase 1)
  // Structured to swap with FastAPI in Phase 2
  // ==========================================
  getIncidents: () => wait(DB.map((x) => ({ ...x }))),

  getIncident: (id) => wait(DB.find((x) => x.id === id)),

  getNotifications: () => wait(NT.map((x) => ({ ...x }))),

  createIncident: async (d) => {
    const cat = d.cat;
    const n = {
      ...makeIncident([
        'INC-' + (1050 + DB.length),
        d.title,
        cat,
        d.loc,
        10 + Math.random() * 80,
        8 + Math.random() * 44,
        d.sev,
        'Pending',
        '',
        new Date().toISOString().slice(0, 10),
        1,
        d.sev === 'Critical' ? 90 : d.sev === 'High' ? 75 : d.sev === 'Medium' ? 52 : 30,
        92,
        Math.round(Math.random() * 30),
      ]),
      desc: d.desc,
    };
    DB = [n, ...DB];
    NT = [
      {
        id: Date.now(),
        t: 'Incident ' + n.id + ' submitted and routed to ' + n.dept + '.',
        time: 'Just now',
        read: false,
      },
      ...NT,
    ];
    return wait(n);
  },

  updateIncident: async (id, p, msg) => {
    DB = DB.map((x) =>
      x.id === id
        ? {
            ...x,
            ...p,
            hist: msg ? [...x.hist, [getNowTime(), msg]] : x.hist,
          }
        : x
    );
    if (msg) {
      NT = [
        {
          id: Date.now(),
          t: id + ': ' + msg,
          time: 'Just now',
          read: false,
        },
        ...NT,
      ];
    }
    return wait(1);
  },

  assignDepartment: (id, dept) =>
    api.updateIncident(id, { dept }, 'Assigned to ' + dept + ' Department'),

  assignOfficer: (id, officer) =>
    api.updateIncident(
      id,
      { officer, status: 'Assigned' },
      'Field officer assigned: ' + officer
    ),

  updateStatus: (id, status) =>
    api.updateIncident(id, { status }, 'Status changed to ' + status),

  readAll: () => {
    NT = NT.map((x) => ({ ...x, read: true }));
    return wait(1);
  },
};

export default api;
