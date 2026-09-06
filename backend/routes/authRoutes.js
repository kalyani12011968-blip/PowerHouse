const express = require("express");
<<<<<<< HEAD

const {
    register,
    login,
    me
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", me);

module.exports = router;
=======
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
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
