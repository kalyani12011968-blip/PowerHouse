<<<<<<< HEAD
const {
    getAlerts,
    createAlert
} = require("../services/alertService");

function listAlerts(req, res) {

    res.json({
        success: true,
        data: getAlerts()
    });
}

function testAlert(req, res) {

    const alert =
        createAlert({
            deviceId:
                req.body.deviceId ||
                "ESP32-001",

            event:
                req.body.event ||
                "TEST_ALERT",

            riskScore:
                req.body.riskScore ||
                90,

            status:
                req.body.status ||
                "CRITICAL",

            message:
                req.body.message ||
                "Test JAL-RAKSHAK alert"
        });

    res.status(201).json({
        success: true,
        data: alert
    });
}

module.exports = {
    listAlerts,
    testAlert
};
=======
const alertService = require("../services/alertService");
const notificationService =
  require("../services/notificationService");

const sendAlert = async (req, res, next) => {
  try {
    const alert =
      await alertService.createAlert(req.body);

    const sms =
      await notificationService.sendSMS(req.body);

    res.status(201).json({
      success: true,
      data: {
        alert,
        sms
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAlerts = async (req, res, next) => {
  try {
    const data =
      await alertService.getAlerts();

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendAlert,
  getAlerts
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
