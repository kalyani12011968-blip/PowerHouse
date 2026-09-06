const express = require("express");
<<<<<<< HEAD

const {
    listEvents
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", listEvents);

module.exports = router;
=======
const controller =
  require("../controllers/eventController");

const router = express.Router();

router.get("/", controller.getEvents);
router.get("/:id", controller.getEvent);
router.post("/", controller.createEvent);

module.exports = router;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
