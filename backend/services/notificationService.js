<<<<<<< HEAD
const {
  sendSMS
} = require("../../alerts/gsm/smsService");

const {
  getLocation,
  getGoogleMapsLink
} = require("../../alerts/gps/locationService");

const {
  activateBuzzer
} = require("../../alerts/local/buzzerService");

const {
  showStatus,
  showAlert
} = require("../../alerts/local/displayService");

async function processNotification(data) {

  const riskScore = Number(
    data.riskScore ?? 0
  );

  const event =
    data.event ||
    data.eventType ||
    "NORMAL";

  const status =
    data.status ||
    getStatusFromRisk(riskScore);

  /*
   * ========================================
   * LOCAL DISPLAY
   * ========================================
   */

  showStatus({
    status,
    waterLevel: data.waterLevel,
    riskScore,
    waterTrend: data.waterTrend
  });

  /*
   * ========================================
   * SAFE
   * ========================================
   */

  if (riskScore < 51) {

    return {
      success: true,
      alertTriggered: false,
      status: "SAFE"
    };
  }

  /*
   * ========================================
   * WARNING / CRITICAL
   * ========================================
   */

  let buzzerLevel = "WARNING";

  if (riskScore >= 76) {
    buzzerLevel = "CRITICAL";
  }

  const buzzer = activateBuzzer(
    buzzerLevel
  );

  showAlert(
    `WATER RISK: ${status} | Risk ${riskScore}/100`
  );

  /*
   * ========================================
   * GPS
   * ========================================
   */

  const location =
    getLocation(data);

  const mapLink =
    getGoogleMapsLink(data);

  /*
   * ========================================
   * GSM SMS
   * ========================================
   */

  const sms =
    await sendSMS({
      alertType:
        event !== "NORMAL"
          ? event
          : status === "CRITICAL"
            ? "CRITICAL"
            : "GENERAL",
      data
    });

  return {
    success: true,

    alertTriggered: true,

    status,

    riskScore,

    event,

    buzzer,

    sms,

    location,

    mapLink,

    timestamp:
      new Date().toISOString()
  };
}

function getStatusFromRisk(score) {

  if (score >= 76) {
    return "CRITICAL";
  }

  if (score >= 51) {
    return "WARNING";
  }

  if (score >= 26) {
    return "WATCH";
  }

  return "SAFE";
}

module.exports = {
  processNotification,
  getStatusFromRisk
};
=======
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
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
