const TOKEN_KEY = 'vpass_auth_token';
const USER_KEY = 'vpass_auth_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // AUTH
  login: async (email, role) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    });
    setToken(res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res;
  },

  getCurrentUser: async () => {
    return request('/api/auth/me');
  },

  logout: () => {
    removeToken();
  },

  // USERS & EMPLOYEES
  getUsers: async () => request('/api/users'),
  createUser: async (user) => request('/api/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: async (id, user) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  
  getEmployees: async () => request('/api/employees'),
  getEmployeeById: async (id) => request(`/api/employees/${id}`),

  // VISITORS
  getVisitors: async (filters = {}) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) {
        query.set(k, String(v));
      }
    });
    return request(`/api/visitors?${query.toString()}`);
  },

  getVisitorById: async (id) => request(`/api/visitors/${id}`),

  registerVisitor: async (data) => request('/api/visitors', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  approveVisitor: async (id, remarks) => request(`/api/visitors/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ remarks })
  }),

  rejectVisitor: async (id, reason) => request(`/api/visitors/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  checkInVisitor: async (id) => request(`/api/visitors/${id}/checkin`, {
    method: 'POST'
  }),

  checkOutVisitor: async (id) => request(`/api/visitors/${id}/checkout`, {
    method: 'POST'
  }),

  cancelVisitor: async (id) => request(`/api/visitors/${id}/cancel`, {
    method: 'POST'
  }),

  addRemarks: async (id, remarks) => request(`/api/visitors/${id}/remarks`, {
    method: 'POST',
    body: JSON.stringify({ remarks })
  }),

  // REPORTS & LOGS
  getReports: async (startDate, endDate) => {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    return request(`/api/reports?${query.toString()}`);
  },

  getActivityLogs: async () => request('/api/activity-logs')
};
