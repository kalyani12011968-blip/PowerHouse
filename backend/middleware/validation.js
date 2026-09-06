<<<<<<< HEAD
function validateSensorData(req, res, next) {

    const data = req.body;

    if (!data.deviceId && !data.device_id) {

        return res.status(400).json({
            success: false,
            message: "deviceId is required"
        });
    }

    if (
        data.waterLevel === undefined &&
        data.water_level === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "waterLevel is required"
        });
    }

    next();
}

module.exports = {
    validateSensorData
};
=======
const validateSensorData = (req, res, next) => {
  const {
    deviceId,
    waterLevel,
    rainfall,
    temperature,
    latitude,
    longitude
  } = req.body;

  if (!deviceId || typeof deviceId !== "string") {
    return res.status(400).json({
      success: false,
      message: "deviceId is required"
    });
  }

  const numericFields = {
    waterLevel,
    rainfall,
    temperature
  };

  for (const [name, value] of Object.entries(numericFields)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return res.status(400).json({
        success: false,
        message: `${name} must be a finite number`
      });
    }
  }

  if (latitude !== undefined &&
      (typeof latitude !== "number" || latitude < -90 || latitude > 90)) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude"
    });
  }

  if (longitude !== undefined &&
      (typeof longitude !== "number" || longitude < -180 || longitude > 180)) {
    return res.status(400).json({
      success: false,
      message: "Invalid longitude"
    });
  }

  next();
};

const validateDevice = (req, res, next) => {
  if (!req.body.deviceId || typeof req.body.deviceId !== "string") {
    return res.status(400).json({
      success: false,
      message: "deviceId is required"
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  next();
};

module.exports = {
  validateSensorData,
  validateDevice,
  validateLogin
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
