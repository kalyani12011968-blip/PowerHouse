import { apiFetch } from "./api";
export const aiApi = {
  predict: (payload) => apiFetch("/ai/predict", { method: "POST", body: JSON.stringify(payload) }),
  analyze: (payload) => apiFetch("/ai/analyze", { method: "POST", body: JSON.stringify(payload) }),
  chat: (question, sensorData) => apiFetch("/ai/chat", { method: "POST", body: JSON.stringify({ question, sensorData }) })
};
