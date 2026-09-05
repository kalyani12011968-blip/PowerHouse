const sensorService = require("../services/sensorService");
const waterBehaviorService = require("../services/waterBehaviorService");
const riskService = require("../services/riskService");
const eventService = require("../services/eventService");
const deviceService = require("../services/deviceService");

const receiveSensorData = async (req, res, next) => {
  try {
    const reading = await sensorService.saveSensorReading(req.body);

    const history = await sensorService.getHistory(
      req.body.deviceId
    );

    const previous = history.length > 1
      ? history[1]
      : null;

    const baselineHistory = history
      .slice(2, 102)
      .filter((item) => Number.isFinite(item.waterLevel));

    const historical =
      waterBehaviorService.calculateHistoricalBaseline(
        baselineHistory
      );

    const behavior =
      waterBehaviorService.analyzeWaterBehavior(
        reading,
        previous,
        historical
      );

    const sensorQuality =
      req.body.sensorQuality ?? 1;

    const event =
      eventService.classifyEvent({
        ...behavior,
        sensorQuality
      });

    const risk =
      riskService.calculateRisk({
        ...behavior,
        sensorQuality
      });

    await deviceService.updateLastSeen(
      reading.deviceId
    );

    res.status(201).json({
      success: true,
      data: {
        reading,
        behavior: {
          ...behavior,
          sensorQuality
        },
        event,
        risk
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLatestSensorData = async (req, res, next) => {
  try {
    const data = await sensorService.getLatest(
      req.query.deviceId
    );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getSensorHistory = async (req, res, next) => {
  try {
    const data = await sensorService.getHistory(
      req.query.deviceId
    );

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  receiveSensorData,
  getLatestSensorData,
  getSensorHistory
};
