<<<<<<< HEAD
const {
    getRiskBand
} = require("../utils/calculations");

function calculateRisk(data) {

    let score = 0;

    const waterLevel =
        Number(data.waterLevel || 0);

    const rainfall =
        Number(data.rainfall || 0);

    const riseRate =
        Number(data.riseRate || 0);

    const acceleration =
        Number(data.acceleration || 0);

    const sensorQuality =
        Number(data.sensorQuality ?? 100);

    /* Water level */

    if (waterLevel >= 90) {
        score += 40;
    } else if (waterLevel >= 75) {
        score += 30;
    } else if (waterLevel >= 50) {
        score += 15;
    }

    /* Rainfall */

    if (rainfall >= 50) {
        score += 20;
    } else if (rainfall >= 25) {
        score += 12;
    } else if (rainfall >= 10) {
        score += 5;
    }

    /* Rise rate */

    if (riseRate >= 5) {
        score += 25;
    } else if (riseRate >= 2) {
        score += 15;
    } else if (riseRate >= 0.5) {
        score += 7;
    }

    /* Acceleration */

    if (acceleration >= 1) {
        score += 10;
    } else if (acceleration >= 0.3) {
        score += 5;
    }

    /* Sensor quality */

    if (sensorQuality < 50) {
        score -= 10;
    }

    score =
        Math.max(
            0,
            Math.min(100, score)
        );

    const status =
        getRiskBand(score);

    return {
        ...data,
        riskScore: score,
        status
    };
}

module.exports = {
    calculateRisk
};
=======
const calculateRisk = ({
  rainfall = 0,
  riseRate = 0,
  acceleration = 0,
  levelDeviation = 0,
  riseRateDeviation = 0,
  sensorQuality = 1
}) => {
  let score = 0;
  const factors = [];

  if (levelDeviation > 10) {
    score += 20;
    factors.push("water level above local baseline");
  }

  if (levelDeviation > 30) {
    score += 15;
    factors.push("water level significantly above baseline");
  }

  if (levelDeviation > 50) {
    score += 15;
    factors.push("water level near an extreme deviation");
  }

  if (riseRate > 2) {
    score += 15;
    factors.push("water is rising");
  }

  if (riseRate > 8) {
    score += 20;
    factors.push("rapid water-level rise");
  }

  if (acceleration > 3) {
    score += 10;
    factors.push("rise rate is accelerating");
  }

  if (rainfall > 20) {
    score += 10;
    factors.push("elevated rainfall");
  }

  if (rainfall > 50) {
    score += 10;
    factors.push("heavy rainfall");
  }

  if (riseRateDeviation > 5) {
    score += 10;
    factors.push("rise rate above normal behavior");
  }

  if (sensorQuality < 0.7) {
    score -= 10;
    factors.push("reduced sensor confidence");
  }

  score = Math.max(0, Math.min(100, score));

  const status =
    score <= 25
      ? "SAFE"
      : score <= 50
      ? "WATCH"
      : score <= 75
      ? "WARNING"
      : "CRITICAL";

  return {
    riskScore: score,
    status,
    factors
  };
};

module.exports = {
  calculateRisk
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
