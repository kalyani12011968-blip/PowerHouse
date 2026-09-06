function floodAlert(data) {
  return (
    `JAL-RAKSHAK ALERT: FLOOD RISK DETECTED. ` +
    `Water Level: ${data.waterLevel} cm. ` +
    `Rise Rate: ${data.riseRate} cm/min. ` +
    `Risk: ${data.riskScore}/100. ` +
    `Location: ${data.latitude}, ${data.longitude}.`
  );
}

function criticalAlert(data) {
  return (
    `JAL-RAKSHAK CRITICAL ALERT! ` +
    `Immediate water-risk detected. ` +
    `Water Level: ${data.waterLevel} cm. ` +
    `Risk Score: ${data.riskScore}/100. ` +
    `Trend: ${data.waterTrend}. ` +
    `Location: ${data.latitude}, ${data.longitude}.`
  );
}

function abnormalWaterLossAlert(data) {
  return (
    `JAL-RAKSHAK ALERT: ABNORMAL WATER LOSS DETECTED. ` +
    `Water level is changing unexpectedly. ` +
    `Current Level: ${data.waterLevel} cm. ` +
    `Risk: ${data.riskScore}/100. ` +
    `Location: ${data.latitude}, ${data.longitude}.`
  );
}

function sensorAnomalyAlert(data) {
  return (
    `JAL-RAKSHAK SENSOR ALERT: ` +
    `Possible sensor anomaly detected. ` +
    `Device: ${data.deviceId}. ` +
    `Sensor Quality: ${data.sensorQuality}%.`
  );
}

function generalAlert(data) {
  return (
    `JAL-RAKSHAK WARNING: ` +
    `Water risk detected. ` +
    `Risk Score: ${data.riskScore}/100. ` +
    `Water Level: ${data.waterLevel} cm.`
  );
}

module.exports = {
  floodAlert,
  criticalAlert,
  abnormalWaterLossAlert,
  sensorAnomalyAlert,
  generalAlert
};