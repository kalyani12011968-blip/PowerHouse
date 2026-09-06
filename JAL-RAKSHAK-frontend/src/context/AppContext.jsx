import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { USE_MOCK_DATA } from "../services/api";
import { scenarios, historicalSeries, mockWeather } from "../services/mockData";
import { riskStatus } from "../utils/risk";
import { useDevices } from "../hooks/useDevices";
import { useEvents } from "../hooks/useEvents";
import { useAlerts } from "../hooks/useAlerts";
import { useRealtime } from "../hooks/useRealtime";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [scenario, setScenario] = useState("FLOOD_ESCALATION");
  const [reading, setReading] = useState(scenarios.FLOOD_ESCALATION);
  const [simulation, setSimulation] = useState({ running: false, progress: 100, step: 4 });
  const [history, setHistory] = useState(historicalSeries());
  const { devices, setDevices } = useDevices();
  const { events, setEvents } = useEvents();
  const { alerts, setAlerts } = useAlerts();
  const connected = useRealtime((event, data) => {
    if (event === "sensor:update" && data) setReading(data.data || data);
    if (event === "device:update" && data?.deviceId) setDevices(prev => prev.map(d => d.deviceId === data.deviceId ? { ...d, ...data } : d));
    if (event === "event:new" && data) setEvents(prev => [data, ...prev]);
    if (event === "alert:new" && data) setAlerts(prev => [data, ...prev]);
  });

  const riskScore = scenario === "NORMAL" ? 18 : scenario === "ABNORMAL_WATER_LOSS" ? 68 : scenario === "SENSOR_ANOMALY" ? 42 : 82;
  const prediction = {
    event: scenario,
    confidence: scenario === "SENSOR_ANOMALY" ? 87 : scenario === "ABNORMAL_WATER_LOSS" ? 91 : scenario === "NORMAL" ? 99 : 98,
    riskScore,
    status: riskStatus(riskScore),
    modelVersion: "XGBoost v1.0"
  };

  useEffect(() => {
    if (!simulation.running) return;
    const timer = setInterval(() => {
      setSimulation(prev => {
        const next = prev.step >= 4 ? 1 : prev.step + 1;
        return { ...prev, step: next, progress: next * 25 };
      });
    }, 1600);
    return () => clearInterval(timer);
  }, [simulation.running]);

  useEffect(() => {
    if (!simulation.running) return;
    const scenarioReading = scenarios[scenario];
    if (scenario === "FLOOD_ESCALATION") {
      const steps = [
        { waterLevel: 65, riseRate: 0.5, rainfall: 8, risk: 18 },
        { waterLevel: 75, riseRate: 2.1, rainfall: 20, risk: 34 },
        { waterLevel: 83, riseRate: 4.8, rainfall: 48, risk: 58 },
        { waterLevel: 91, riseRate: 7.2, rainfall: 80, risk: 82 }
      ];
      const s = steps[Math.min(simulation.step, 4) - 1];
      setReading({ ...scenarioReading, ...s, timestamp: new Date().toISOString() });
    } else {
      setReading({ ...scenarioReading, timestamp: new Date().toISOString() });
    }
  }, [simulation.step, simulation.running, scenario]);

  const setScenarioAndReset = (next) => {
    setScenario(next);
    setReading(scenarios[next]);
    setSimulation({ running: false, progress: next === "FLOOD_ESCALATION" ? 0 : 100, step: 1 });
  };

  const value = useMemo(() => ({
    scenario, setScenario: setScenarioAndReset, reading, setReading, prediction,
    devices, events, alerts, history, setHistory, simulation, setSimulation,
    weather: mockWeather, connected, demoMode: USE_MOCK_DATA
  }), [scenario, reading, prediction, devices, events, alerts, history, simulation, connected]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  return useContext(AppContext);
}
