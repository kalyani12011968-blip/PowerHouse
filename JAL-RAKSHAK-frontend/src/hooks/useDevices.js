import { useEffect, useState } from "react";
import { USE_MOCK_DATA } from "../services/api";
import { deviceApi } from "../services/deviceApi";
import { mockDevices } from "../services/mockData";

export function useDevices() {
  const [devices, setDevices] = useState(mockDevices);
  const [loading, setLoading] = useState(!USE_MOCK_DATA);
  useEffect(() => {
    if (USE_MOCK_DATA) return;
    deviceApi.getAll().then(r => setDevices(r?.data || r)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { devices, setDevices, loading };
}
