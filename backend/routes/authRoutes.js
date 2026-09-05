const express = require("express");
const {
  validateLogin
} = require("../middleware/validation");
const controller =
  require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  controller.register
);

router.post(
  "/login",
  validateLogin,
  controller.login
);

module.exports = router;
