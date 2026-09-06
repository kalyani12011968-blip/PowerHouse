<<<<<<< HEAD
const previousReadings = new Map();

function analyzeWaterBehavior(data) {

    const deviceId =
        data.deviceId;

    const currentLevel =
        Number(data.waterLevel || 0);

    const timestamp =
        new Date(
            data.timestamp ||
            Date.now()
        );

    const previous =
        previousReadings.get(deviceId);

    let riseRate =
        Number(data.riseRate || 0);

    let acceleration =
        Number(data.acceleration || 0);

    if (previous) {

        const deltaMinutes =
            Math.max(
                (
                    timestamp -
                    previous.timestamp
                ) / 60000,
                0.001
            );

        riseRate =
            (
                currentLevel -
                previous.waterLevel
            ) / deltaMinutes;

        acceleration =
            (
                riseRate -
                previous.riseRate
            ) / deltaMinutes;
    }

    let waterTrend = "STABLE";

    if (riseRate >= 5) {
        waterTrend = "RAPID_RISE";
    } else if (riseRate > 0.5) {
        waterTrend = "RISING";
    } else if (riseRate <= -5) {
        waterTrend = "RAPID_FALL";
    } else if (riseRate < -0.5) {
        waterTrend = "FALLING";
    }

    previousReadings.set(
        deviceId,
        {
            waterLevel: currentLevel,
            riseRate,
            timestamp
        }
    );

    return {
        ...data,
        waterLevel: currentLevel,
        riseRate:
            Number(riseRate.toFixed(4)),
        acceleration:
            Number(acceleration.toFixed(4)),
        waterTrend
    };
}

module.exports = {
    analyzeWaterBehavior
};
=======
const {
  calculateRiseRate,
  calculateAcceleration,
  determineTrend,
  calculateDeviation
} = require("../utils/calculations");

const calculateHistoricalBaseline = (history) => {
  if (!history.length) {
    return {
      averageLevel: 0,
      maxLevel: 0,
      averageRiseRate: 0,
      maxRiseRate: 0,
      averageRainfall: 0
    };
  }

  const levels = history
    .map((x) => Number(x.waterLevel))
    .filter(Number.isFinite);

  const rainfalls = history
    .map((x) => Number(x.rainfall))
    .filter(Number.isFinite);

  const rates = history
    .map((x) => Number(x.riseRate))
    .filter(Number.isFinite);

  const average = (values) =>
    values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

  return {
    averageLevel: average(levels),
    maxLevel: levels.length ? Math.max(...levels) : 0,
    averageRiseRate: average(rates),
    maxRiseRate: rates.length ? Math.max(...rates) : 0,
    averageRainfall: average(rainfalls)
  };
};

const analyzeWaterBehavior = (
  current,
  previous,
  historical = {}
) => {
  const currentLevel = current.waterLevel;
  const previousLevel = previous?.waterLevel ?? currentLevel;

  const currentTime = new Date(current.timestamp).getTime();
  const previousTime = previous
    ? new Date(previous.timestamp).getTime()
    : currentTime - 15 * 60000;

  const timeMinutes = Math.max(
    (currentTime - previousTime) / 60000,
    0.25
  );

  const riseRate = calculateRiseRate(
    currentLevel,
    previousLevel,
    timeMinutes
  );

  const previousRate = previous?.riseRate ?? 0;

  const acceleration = calculateAcceleration(
    riseRate,
    previousRate,
    timeMinutes
  );

  const waterTrend = determineTrend(riseRate);

  const averageLevel =
    historical.averageLevel ?? currentLevel;

  const averageRiseRate =
    historical.averageRiseRate ?? 0;

  const averageRainfall =
    historical.averageRainfall ?? current.rainfall;

  return {
    waterLevel: currentLevel,
    rainfall: current.rainfall,
    temperature: current.temperature,
    riseRate: Number(riseRate.toFixed(3)),
    acceleration: Number(acceleration.toFixed(3)),
    waterTrend,
    historicalAverageLevel: Number(
      averageLevel.toFixed(3)
    ),
    historicalMaxLevel: Number(
      (historical.maxLevel ?? currentLevel).toFixed(3)
    ),
    historicalAverageRiseRate: Number(
      averageRiseRate.toFixed(3)
    ),
    historicalMaxRiseRate: Number(
      (historical.maxRiseRate ?? riseRate).toFixed(3)
    ),
    historicalAverageRainfall: Number(
      averageRainfall.toFixed(3)
    ),
    levelDeviation: Number(
      calculateDeviation(
        currentLevel,
        averageLevel
      ).toFixed(3)
    ),
    riseRateDeviation: Number(
      calculateDeviation(
        riseRate,
        averageRiseRate
      ).toFixed(3)
    ),
    rainfallDeviation: Number(
      calculateDeviation(
        current.rainfall,
        averageRainfall
      ).toFixed(3)
    )
  };
};

module.exports = {
  analyzeWaterBehavior,
  calculateHistoricalBaseline
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
