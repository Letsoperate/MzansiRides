const ADMIN_TOKEN_KEY = "mzansi_admin_token";
const ADMIN_USER_KEY = "mzansi_admin_user";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminSession(token, admin) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function hasAdminSession() {
  return Boolean(getAdminToken());
}

export function getAdminUser() {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function apiRequest(path, options = {}) {
  const token = getAdminToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(payload.message || "Request failed");
    err.status = response.status;
    throw err;
  }

  return payload;
}
