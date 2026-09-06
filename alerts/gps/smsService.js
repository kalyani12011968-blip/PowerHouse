require("dotenv").config();

const templates = require("./smsTemplates");

function buildMessage(alertType, data) {
  switch (alertType) {
    case "FLOOD_ESCALATION":
      return templates.floodAlert(data);

    case "CRITICAL":
      return templates.criticalAlert(data);

    case "ABNORMAL_WATER_LOSS":
      return templates.abnormalWaterLossAlert(data);

    case "SENSOR_ANOMALY":
      return templates.sensorAnomalyAlert(data);

    default:
      return templates.generalAlert(data);
  }
}

/*
 * Prototype SMS sender.
 *
 * In the real hardware version:
 *
 * Node Backend
 *      ↓
 * ESP32
 *      ↓
 * SIM800
 *      ↓
 * SMS
 *
 * The Node backend should NOT directly control the SIM800
 * unless you deliberately connect the GSM module to the server.
 */

async function sendSMS({
  phoneNumber,
  alertType,
  data
}) {
  const number =
    phoneNumber ||
    process.env.ALERT_PHONE_NUMBER;

  const message = buildMessage(
    alertType,
    data
  );

  if (!number) {
    console.log("\n[GSM] No phone number configured.");
    console.log("[GSM] SMS simulation:");
    console.log(message);

    return {
      success: false,
      simulated: true,
      reason: "No phone number configured",
      message
    };
  }

  console.log("\n================================");
  console.log("GSM SMS ALERT");
  console.log("================================");
  console.log("To:", number);
  console.log("Type:", alertType);
  console.log("Message:", message);
  console.log("================================");

  /*
   * Hardware integration will happen through ESP32/SIM800.
   */

  return {
    success: true,
    simulated: true,
    phoneNumber: number,
    alertType,
    message,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  sendSMS,
  buildMessage
};