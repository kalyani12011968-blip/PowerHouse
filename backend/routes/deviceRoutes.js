const express = require("express");
<<<<<<< HEAD

const {
    listDevices,
    getDeviceById,
    createDevice,
    deviceHeartbeat
} = require("../controllers/deviceController");

const router = express.Router();

router.get("/", listDevices);

router.get("/:deviceId", getDeviceById);

router.post("/", createDevice);

router.post("/:deviceId/heartbeat", deviceHeartbeat);

module.exports = router;
=======
const {
  validateDevice
} = require("../middleware/validation");
const controller =
  require("../controllers/deviceController");

const router = express.Router();

router.get("/", controller.getDevices);
router.get("/:id", controller.getDevice);
router.post(
  "/",
  validateDevice,
  controller.registerDevice
);

module.exports = router;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
