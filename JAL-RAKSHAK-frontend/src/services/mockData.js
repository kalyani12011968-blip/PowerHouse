const now = Date.now();

const makeReading = (overrides = {}) => ({
  deviceId: "ESP32-001",
  timestamp: new Date(now).toISOString(),
  waterLevel: 91,
  rainfall: 80,
  temperature: 29,
  riseRate: 7.2,
  acceleration: 1.4,
  waterTrend: "RAPID_RISE",
  sensorQuality: 98,
  latitude: 12.9716,
  longitude: 77.5946,
  historicalAvgLevel: 70,
  historicalMaxLevel: 90,
  historicalAvgRiseRate: 1.5,
  historicalMaxRiseRate: 8,
  ...overrides
});

export const scenarios = {
  NORMAL: makeReading({
    waterLevel: 65, rainfall: 8, temperature: 28, riseRate: 0.5,
    acceleration: 0.05, waterTrend: "STABLE", sensorQuality: 99
  }),
  FLOOD_ESCALATION: makeReading(),
  ABNORMAL_WATER_LOSS: makeReading({
    waterLevel: 63, rainfall: 15, temperature: 29, riseRate: -7.5,
    acceleration: -1.3, waterTrend: "RAPID_FALL", sensorQuality: 96
  }),
  SENSOR_ANOMALY: makeReading({
    deviceId: "ESP32-004", waterLevel: 118, rainfall: 4, temperature: 29,
    riseRate: 12.8, acceleration: 8.4, waterTrend: "ERRATIC", sensorQuality: 32
  })
};

export const mockDevices = [
  { deviceId: "ESP32-001", status: "ONLINE", location: "Monitoring Point A", latitude: 12.9716, longitude: 77.5946, riskScore: 82, waterTrend: "RAPID_RISE", sensorQuality: 98, lastSeen: new Date(now - 10000).toISOString(), waterLevel: 91 },
  { deviceId: "ESP32-002", status: "ONLINE", location: "Monitoring Point B", latitude: 12.9792, longitude: 77.5915, riskScore: 47, waterTrend: "RISING", sensorQuality: 96, lastSeen: new Date(now - 22000).toISOString(), waterLevel: 73 },
  { deviceId: "ESP32-003", status: "ONLINE", location: "Monitoring Point C", latitude: 12.9658, longitude: 77.6011, riskScore: 24, waterTrend: "STABLE", sensorQuality: 99, lastSeen: new Date(now - 32000).toISOString(), waterLevel: 61 },
  { deviceId: "ESP32-004", status: "WARNING", location: "Monitoring Point D", latitude: 12.956, longitude: 77.585, riskScore: 42, waterTrend: "ERRATIC", sensorQuality: 32, lastSeen: new Date(now - 72000).toISOString(), waterLevel: 118 }
];

export const mockEvents = [
  { eventId: "EVT-2042", deviceId: "ESP32-001", event: "FLOOD_ESCALATION", riskScore: 82, confidence: 98, timestamp: new Date(now - 180000).toISOString(), latitude: 12.9716, longitude: 77.5946, status: "ACTIVE" },
  { eventId: "EVT-2041", deviceId: "ESP32-004", event: "SENSOR_ANOMALY", riskScore: 42, confidence: 87, timestamp: new Date(now - 3600000).toISOString(), latitude: 12.956, longitude: 77.585, status: "INVESTIGATE" },
  { eventId: "EVT-2038", deviceId: "ESP32-002", event: "ABNORMAL_WATER_LOSS", riskScore: 68, confidence: 91, timestamp: new Date(now - 7200000).toISOString(), latitude: 12.9792, longitude: 77.5915, status: "INVESTIGATE" },
  { eventId: "EVT-2036", deviceId: "ESP32-003", event: "NORMAL", riskScore: 18, confidence: 99, timestamp: new Date(now - 10800000).toISOString(), latitude: 12.9658, longitude: 77.6011, status: "CLOSED" }
];

export const mockAlerts = [
  { alertId: "ALT-9001", deviceId: "ESP32-001", type: "FLOOD_ESCALATION", severity: "CRITICAL", message: "Flood escalation detected", sentAt: new Date(now - 120000).toISOString(), status: "SENT", delivery: "GSM SMS" },
  { alertId: "ALT-8998", deviceId: "ESP32-002", type: "ABNORMAL_WATER_LOSS", severity: "WARNING", message: "Abnormal water-loss behavior detected", sentAt: new Date(now - 6900000).toISOString(), status: "ACKNOWLEDGED", delivery: "Dashboard" },
  { alertId: "ALT-8992", deviceId: "ESP32-004", type: "SENSOR_ANOMALY", severity: "WATCH", message: "Sensor readings are inconsistent", sentAt: new Date(now - 3500000).toISOString(), status: "PENDING", delivery: "Local alarm" }
];

export function historicalSeries() {
  const points = [];
  for (let i = 23; i >= 0; i--) {
    const flood = i < 5;
    const level = flood ? 68 + (23 - i) * 4.7 : 61 + Math.sin(i / 2) * 2 + (23 - i) * 0.25;
    points.push({
      time: `${String((24 - i) % 24).padStart(2, "0")}:00`,
      waterLevel: Number(level.toFixed(1)),
      riseRate: Number((flood ? 2.5 + (23 - i) * 0.9 : 0.4 + Math.sin(i) * 0.15).toFixed(2)),
      acceleration: Number((flood ? 0.5 + (23 - i) * 0.16 : 0.05).toFixed(2)),
      rainfall: flood ? 35 + (23 - i) * 9 : 4 + (i % 4) * 2,
      temperature: 27 + Math.sin(i / 4) * 2,
      risk: flood ? 28 + (23 - i) * 11 : 15 + (i % 4) * 2
    });
  }
  return points;
}

export const mockWeather = {
  temperature: 29,
  rainfallForecast: 18.4,
  precipitationProbability: 72,
  forecast: [
    { time: "09:00", rainfall: 3, probability: 35 },
    { time: "12:00", rainfall: 8, probability: 52 },
    { time: "15:00", rainfall: 18, probability: 72 },
    { time: "18:00", rainfall: 26, probability: 81 },
    { time: "21:00", rainfall: 12, probability: 64 }
  ],
  context: "Heavy rainfall expected"
};
