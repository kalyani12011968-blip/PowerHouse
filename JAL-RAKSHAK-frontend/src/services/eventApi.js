import { apiFetch } from "./api";
export const eventApi = {
  getAll: () => apiFetch("/events"),
  getById: (id) => apiFetch(`/events/${encodeURIComponent(id)}`)
};
