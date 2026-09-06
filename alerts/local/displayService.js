
let currentDisplay = {
  status: "SAFE",
  message: "System Ready"
};

function showStatus({
  status = "SAFE",
  waterLevel = 0,
  riskScore = 0,
  waterTrend = "STABLE"
} = {}) {

  currentDisplay = {
    status,
    waterLevel,
    riskScore,
    waterTrend
  };

  console.log("\n================================");
  console.log("LOCAL DISPLAY");
  console.log("================================");
  console.log("STATUS      :", status);
  console.log("WATER LEVEL :", `${waterLevel} cm`);
  console.log("RISK SCORE  :", `${riskScore}/100`);
  console.log("TREND       :", waterTrend);
  console.log("================================");

  /*
   * Actual hardware:
   *
   * ESP32
   *   ↓
   * OLED / LCD
   *
   * The ESP32 firmware will display
   * these values on the physical screen.
   */

  return {
    success: true,
    display: currentDisplay
  };
}

function showAlert(message) {
  currentDisplay = {
    status: "ALERT",
    message
  };

  console.log("\n================================");
  console.log("DISPLAY ALERT");
  console.log("================================");
  console.log(message);
  console.log("================================");

  return {
    success: true,
    display: currentDisplay
  };
}

function getDisplayStatus() {
  return currentDisplay;
}

module.exports = {
  showStatus,
  showAlert,
  getDisplayStatus
};