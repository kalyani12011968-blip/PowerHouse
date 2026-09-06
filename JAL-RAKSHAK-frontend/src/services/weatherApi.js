import { apiFetch } from "./api";
export const weatherApi = { getCurrent: () => apiFetch("/weather") };
