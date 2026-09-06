import { useCallback, useEffect, useState } from "react";
import { USE_MOCK_DATA } from "../services/api";
import { sensorApi } from "../services/sensorApi";
import { scenarios } from "../services/mockData";

export function useSensors() {
  const [reading, setReading] = useState(scenarios.FLOOD_ESCALATION);
  const [loading, setLoading] = useState(!USE_MOCK_DATA);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (USE_MOCK_DATA) return;
    setLoading(true);
    try {
      const r = await sensorApi.getLatest();
      setReading(r?.data || r);
      setError("");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { reading, setReading, loading, error, refresh };
}
