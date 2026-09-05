const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const token = header.slice(7);

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
    );
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = { authenticate };
