import { apiFetch } from "./api";
export const deviceApi = {
  getAll: () => apiFetch("/devices"),
  getById: (id) => apiFetch(`/devices/${encodeURIComponent(id)}`)
};
