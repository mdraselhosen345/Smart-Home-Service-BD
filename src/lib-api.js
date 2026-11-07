import { auth } from './Firebase/Firebase';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export async function apiRequest(path, { method = 'GET', body, admin = false, headers = {} } = {}) {
  const token = admin ? await auth.currentUser?.getIdToken() : null;
  if (admin && !token) throw new Error('Admin login required. Please sign in again.');
  const response = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload;
}
