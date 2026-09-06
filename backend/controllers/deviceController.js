<<<<<<< HEAD
const {
    getDevices,
    getDevice,
    registerDevice,
    heartbeat
} = require("../services/deviceService");

function listDevices(req, res) {

    res.json({
        success: true,
        data: getDevices()
    });
}

function getDeviceById(req, res) {

    const device =
        getDevice(
            req.params.deviceId
        );

    if (!device) {

        return res.status(404).json({
            success: false,
            message: "Device not found"
        });
    }

    res.json({
        success: true,
        data: device
    });
}

function createDevice(req, res) {

    const device =
        registerDevice(
            req.body
        );

    res.status(201).json({
        success: true,
        data: device
    });
}

function deviceHeartbeat(req, res) {

    const device =
        heartbeat(
            req.params.deviceId
        );

    if (!device) {

        return res.status(404).json({
            success: false,
            message: "Device not found"
        });
    }

    res.json({
        success: true,
        data: device
    });
}

module.exports = {
    listDevices,
    getDeviceById,
    createDevice,
    deviceHeartbeat
};
=======
const deviceService = require("../services/deviceService");

const registerDevice = async (req, res, next) => {
  try {
    const device =
      await deviceService.registerDevice(req.body);

    res.status(201).json({
      success: true,
      data: device
    });
  } catch (error) {
    next(error);
  }
};

const getDevices = async (req, res, next) => {
  try {
    const data =
      await deviceService.getDevices();

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getDevice = async (req, res, next) => {
  try {
    const device =
      await deviceService.getDevice(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDevice,
  getDevices,
  getDevice
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
