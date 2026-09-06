const buildAlertMessage = (data) => {
  return [
    "JAL-RAKSHAK ALERT",
    `Device: ${data.deviceId || "Unknown"}`,
    `Event: ${data.event || "Unknown"}`,
    `Risk: ${data.riskScore ?? "N/A"}/100`,
    `Status: ${data.status || "UNKNOWN"}`,
    `Water Level: ${data.waterLevel ?? "N/A"}`,
    `Rise Rate: ${data.riseRate ?? "N/A"}`,
    `Location: ${data.latitude ?? "N/A"}, ${data.longitude ?? "N/A"}`
  ].join("\n");
};

const sendSMS = async (data) => {
  const message = buildAlertMessage(data);

  if (!process.env.ALERT_PHONE_NUMBER) {
    return {
      sent: false,
      reason: "ALERT_PHONE_NUMBER is not configured",
      message
    };
  }

  return {
    sent: false,
    reason: "SIM800/GSM gateway connection is not configured in the server",
    message
  };
};

module.exports = {
  buildAlertMessage,
  sendSMS
};
