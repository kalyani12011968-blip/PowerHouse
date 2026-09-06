import { useEffect, useState } from "react";
import { USE_MOCK_DATA } from "../services/api";
import { alertApi } from "../services/alertApi";
import { mockAlerts } from "../services/mockData";

export function useAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  useEffect(() => {
    if (USE_MOCK_DATA) return;
    alertApi.getAll().then(r => setAlerts(r?.data || r)).catch(() => {});
  }, []);
  return { alerts, setAlerts };
}
