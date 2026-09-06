<<<<<<< HEAD
const users = [];

function register(req, res) {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            success: false,
            message:
                "Name, email and password are required"
        });
    }

    const existing =
        users.find(
            user =>
                user.email === email
        );

    if (existing) {

        return res.status(409).json({
            success: false,
            message:
                "User already exists"
        });
    }

    const user = {

        userId:
            `USR-${Date.now()}`,

        name,

        email,

        role:
            "VIEWER"
    };

    users.push({
        ...user,
        password
    });

    res.status(201).json({
        success: true,
        data: user
    });
}

function login(req, res) {

    const {
        email,
        password
    } = req.body;

    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );

    if (!user) {

        return res.status(401).json({
            success: false,
            message:
                "Invalid email or password"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        token:
            `demo-token-${user.userId}`,
        user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

function me(req, res) {

    res.json({
        success: true,
        message:
            "Development authentication active"
    });
}

module.exports = {
    register,
    login,
    me
};
=======
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
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
