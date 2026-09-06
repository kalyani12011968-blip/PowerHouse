<<<<<<< HEAD
function errorHandler(err, req, res, next) {

    console.error("Backend Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            "Internal server error"
    });
}

module.exports = errorHandler;
=======
const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = errorHandler;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
