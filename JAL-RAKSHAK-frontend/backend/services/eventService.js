const classifyEvent = ({
  waterTrend,
  riseRate,
  rainfall,
  levelDeviation,
  sensorQuality = 1
}) => {
  if (sensorQuality < 0.4) {
    return "SENSOR_ANOMALY";
  }

  if (
    (waterTrend === "RAPID_RISE" && rainfall > 20) ||
    (waterTrend === "RAPID_RISE" && levelDeviation > 30)
  ) {
    return "FLOOD_ESCALATION";
  }

  if (
    waterTrend === "RAPID_FALL" &&
    rainfall < 10 &&
    levelDeviation < -20
  ) {
    return "ABNORMAL_WATER_LOSS";
  }

  if (riseRate > 8) {
    return "RAPID_WATER_RISE";
  }

  if (riseRate < -8) {
    return "RAPID_WATER_LOSS";
  }

  return "NORMAL";
};

const createEventRecord = (input) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  timestamp: new Date().toISOString(),
  ...input
});

module.exports = {
  classifyEvent,
  createEventRecord
};
