const BASE_URL = 'http://localhost:8000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = resp.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await resp.json().catch(() => null) : await resp.text().catch(() => null);

  if (!resp.ok) {
    const message = (isJSON && data && (data.message || data.error)) || resp.statusText || 'Request failed';
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  health: () => request('/health', { method: 'GET' }),
  // VMs
  listVMs: () => request('/vm', { method: 'GET' }),
  getVM: (id) => request(`/vm/${encodeURIComponent(id)}`, { method: 'GET' }),
  createVM: (payload) => request('/vm/create', { method: 'POST', body: JSON.stringify(payload) }),
  updateVM: (id, payload) => request(`/vm/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteVM: (id) => request(`/vm/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  actionVM: (id, action) => request(`/vm/${encodeURIComponent(id)}/action`, { method: 'POST', body: JSON.stringify({ action }) }),
};
