export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const GATEWAY_URL =
  import.meta.env.VITE_GATEWAY_URL || "http://localhost:5000";

export const USE_MOCK_DATA =
  String(import.meta.env.VITE_USE_MOCK_DATA ?? "true").toLowerCase() === "true";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed (${response.status})`);
  }
  return response.json();
}
