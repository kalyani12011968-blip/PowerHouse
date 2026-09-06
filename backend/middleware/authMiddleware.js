<<<<<<< HEAD
function authMiddleware(req, res, next) {

    const token =
        req.headers.authorization;

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    next();
}

module.exports = authMiddleware;
=======
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
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
