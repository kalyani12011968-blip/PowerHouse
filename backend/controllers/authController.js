const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const users = new Map();

const hashPassword = (password) => {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
};

const register = (req, res) => {
  const {
    email,
    password,
    name
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  if (users.has(email)) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  users.set(email, {
    email,
    name: name || email,
    passwordHash: hashPassword(password)
  });

  res.status(201).json({
    success: true,
    message: "User registered"
  });
};

const login = (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user = users.get(email);

  if (
    !user ||
    user.passwordHash !== hashPassword(password)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    {
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET || "development-secret",
    {
      expiresIn: "24h"
    }
  );

  res.json({
    success: true,
    token,
    user: {
      email: user.email,
      name: user.name
    }
  });
};

module.exports = {
  register,
  login
};
