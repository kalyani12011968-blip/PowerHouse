import { apiFetch } from "./api";
export const alertApi = {
  getAll: () => apiFetch("/alerts")
};
