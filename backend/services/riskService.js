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
