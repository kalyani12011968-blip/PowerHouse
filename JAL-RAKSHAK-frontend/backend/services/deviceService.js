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
