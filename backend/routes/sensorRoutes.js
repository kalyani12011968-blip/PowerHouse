const express = require("express");
<<<<<<< HEAD

const {
    receiveSensorData
} = require("../controllers/sensorController");

const router = express.Router();

/*
 * POST /api/sensors
 * Receive sensor data from ESP32 / MQTT Gateway
 */
router.post("/", receiveSensorData);

/*
 * GET /api/sensors
 * Test/read sensor endpoint
 *
 * This is currently a basic GET endpoint.
 * Later we can connect it directly to Neon PostgreSQL.
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sensor data endpoint is working",
        data: []
    });
});

module.exports = router;
=======
const {
  validateSensorData
} = require("../middleware/validation");
const controller =
  require("../controllers/sensorController");

const router = express.Router();

router.post(
  "/",
  validateSensorData,
  controller.receiveSensorData
);

router.get(
  "/latest",
  controller.getLatestSensorData
);

router.get(
  "/history",
  controller.getSensorHistory
);

module.exports = router;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
