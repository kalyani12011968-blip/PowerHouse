const express = require("express");

const router = express.Router();

const {
    receiveSensorData,
    getLatestSensorData,
    getSensorHistory
} = require("../controllers/sensorController");


router.post(
    "/",
    receiveSensorData
);


router.get(
    "/latest",
    getLatestSensorData
);


router.get(
    "/history",
    getSensorHistory
);


module.exports = router;