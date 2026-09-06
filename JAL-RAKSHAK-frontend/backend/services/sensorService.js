const fs = require("fs");
const path = require("path");
const { db } = require("../config/firebase");

const DATA_FILE = path.join(__dirname, "../data/sensorData.json");

const ensureFile = () => {
  const directory = path.dirname(DATA_FILE);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
  }
};

const readLocal = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

const writeLocal = (data) => {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const saveSensorReading = async (data) => {
  const reading = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: data.timestamp || new Date().toISOString(),
    deviceId: data.deviceId,
    waterLevel: data.waterLevel,
    rainfall: data.rainfall,
    temperature: data.temperature,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    sensorQuality: data.sensorQuality ?? 1
  };

  if (db) {
    const ref = await db.collection("sensor_readings").add(reading);
    return {
      ...reading,
      id: ref.id
    };
  }

  const history = readLocal();
  history.push(reading);

  if (history.length > 10000) {
    history.splice(0, history.length - 10000);
  }

  writeLocal(history);
  return reading;
};

const getHistory = async (deviceId) => {
  if (db) {
    let query = db
      .collection("sensor_readings")
      .orderBy("timestamp", "desc")
      .limit(1000);

    if (deviceId) {
      query = db
        .collection("sensor_readings")
        .where("deviceId", "==", deviceId)
        .orderBy("timestamp", "desc")
        .limit(1000);
    }

    const snap = await query.get();

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  return readLocal()
    .filter((item) => !deviceId || item.deviceId === deviceId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 1000);
};

const getLatest = async (deviceId) => {
  const history = await getHistory(deviceId);
  return history.length ? history[0] : null;
};

const getPrevious = async (deviceId) => {
  const history = await getHistory(deviceId);
  return history.length > 1 ? history[1] : null;
};

module.exports = {
  saveSensorReading,
  getLatest,
  getPrevious,
  getHistory
};
