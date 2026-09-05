const express = require("express");
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
