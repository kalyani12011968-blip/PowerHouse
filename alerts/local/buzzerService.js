
let buzzerState = false;

function activateBuzzer(level = "WARNING") {
  buzzerState = true;

  console.log("\n================================");
  console.log("LOCAL BUZZER ACTIVATED");
  console.log("================================");
  console.log("Alert Level:", level);
  console.log("Buzzer:", "ON");
  console.log("================================");

  /*
   * Actual hardware:
   *
   * ESP32 GPIO
   *      ↓
   * Buzzer
   *
   * Example:
   * digitalWrite(BUZZER_PIN, HIGH);
   */

  return {
    success: true,
    buzzer: "ON",
    level,
    timestamp: new Date().toISOString()
  };
}

function deactivateBuzzer() {
  buzzerState = false;

  console.log("Local buzzer OFF");

  return {
    success: true,
    buzzer: "OFF",
    timestamp: new Date().toISOString()
  };
}

function getBuzzerStatus() {
  return {
    active: buzzerState
  };
}

module.exports = {
  activateBuzzer,
  deactivateBuzzer,
  getBuzzerStatus
};