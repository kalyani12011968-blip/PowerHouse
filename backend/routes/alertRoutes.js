const express = require("express");
<<<<<<< HEAD

const {
    listAlerts,
    testAlert
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", listAlerts);

router.post("/test", testAlert);

module.exports = router;
=======
const controller =
  require("../controllers/alertController");

const router = express.Router();

router.get("/", controller.getAlerts);
router.post("/", controller.sendAlert);

module.exports = router;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
