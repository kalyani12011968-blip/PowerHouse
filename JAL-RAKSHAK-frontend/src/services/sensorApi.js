import { apiFetch } from "./api";
export const sensorApi = {
  getLatest: () => apiFetch("/sensors/latest"),
  getHistory: (deviceId) => apiFetch(`/sensors/history${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ""}`),
  getAll: () => apiFetch("/sensors")
};
