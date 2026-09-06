const express = require("express");

const {
    weather
} = require("../controllers/weatherController");

const router = express.Router();

router.get("/", weather);

module.exports = router;