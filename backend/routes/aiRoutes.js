const express = require("express");

const {
    prediction,
    analyze,
    chat
} = require("C:\\JAL-RAKSHAK\\JAL-RAKSHAK\\backend\\controllers\\aiController.js");

const router = express.Router();

router.post("/predict", prediction);

router.post("/analyze", analyze);

router.post("/chat", chat);

module.exports = router;