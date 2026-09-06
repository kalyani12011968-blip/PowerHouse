<<<<<<< HEAD
const {
    readCollection,
    writeCollection
} = require("./storageService");

function getDevices() {

    return readCollection(
        "devices"
    );
}

function getDevice(deviceId) {

    return getDevices().find(
        device =>
            device.deviceId === deviceId
    );
}

function registerDevice(data) {

    const devices =
        getDevices();

    const existing =
        devices.find(
            d =>
                d.deviceId ===
                data.deviceId
        );

    if (existing) {
        return existing;
    }

    const device = {

        deviceId:
            data.deviceId,

        name:
            data.name ||
            data.deviceId,

        location:
            data.location ||
            "Unknown",

        latitude:
            Number(data.latitude || 0),

        longitude:
            Number(data.longitude || 0),

        status:
            "ONLINE",

        lastHeartbeat:
            new Date().toISOString()
    };

    devices.push(device);

    writeCollection(
        "devices",
        devices
    );

    return device;
}

function heartbeat(deviceId) {

    const devices =
        getDevices();

    const device =
        devices.find(
            d =>
                d.deviceId ===
                deviceId
        );

    if (!device) {
        return null;
    }

    device.status = "ONLINE";

    device.lastHeartbeat =
        new Date().toISOString();

    writeCollection(
        "devices",
        devices
    );

    return device;
}

module.exports = {
    getDevices,
    getDevice,
    registerDevice,
    heartbeat
};
=======
const { db } = require("../config/firebase");

const localDevices = new Map();

const registerDevice = async (data) => {
  const device = {
    deviceId: data.deviceId,
    name: data.name || data.deviceId,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    status: "ONLINE",
    battery: data.battery ?? null,
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString()
  };

  if (db) {
    await db
      .collection("devices")
      .doc(device.deviceId)
      .set(device, { merge: true });
  } else {
    localDevices.set(device.deviceId, device);
  }

  return device;
};

const updateLastSeen = async (deviceId) => {
  const data = {
    status: "ONLINE",
    lastSeen: new Date().toISOString()
  };

  if (db) {
    await db.collection("devices").doc(deviceId).set(data, { merge: true });
    return;
  }

  const device = localDevices.get(deviceId);

  if (device) {
    localDevices.set(deviceId, {
      ...device,
      ...data
    });
  }
};

const getDevices = async () => {
  if (db) {
    const snap = await db.collection("devices").get();

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  return [...localDevices.values()];
};

const getDevice = async (id) => {
  if (db) {
    const doc = await db.collection("devices").doc(id).get();

    return doc.exists
      ? {
          id: doc.id,
          ...doc.data()
        }
      : null;
  }

  return localDevices.get(id) || null;
};

module.exports = {
  registerDevice,
  updateLastSeen,
  getDevices,
  getDevice
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
