<<<<<<< HEAD
const {
    addToCollection,
    readCollection
} = require("./storageService");

function createAlert(data) {

    const alert = {

        alertId:
            `ALT-${Date.now()}`,

        deviceId:
            data.deviceId,

        type:
            data.event ||
            "WATER_RISK",

        severity:
            data.status ||
            "WARNING",

        riskScore:
            data.riskScore || 0,

        message:
            data.message ||
            `Water risk detected. Risk score: ${data.riskScore}/100`,

        status:
            "ACTIVE",

        createdAt:
            new Date().toISOString()
    };

    addToCollection(
        "alerts",
        alert
    );

    return alert;
}

function getAlerts() {

    return readCollection(
        "alerts"
    );
}

module.exports = {
    createAlert,
    getAlerts
};
=======
const { db } = require("../config/firebase");

const localAlerts = [];

const createAlert = async (data) => {
  const alert = {
    ...data,
    timestamp: new Date().toISOString(),
    deliveryStatus: "PENDING"
  };

  if (db) {
    const ref = await db.collection("alerts").add(alert);

    return {
      id: ref.id,
      ...alert
    };
  }

  alert.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localAlerts.push(alert);

  return alert;
};

const getAlerts = async () => {
  if (db) {
    const snap = await db
      .collection("alerts")
      .orderBy("timestamp", "desc")
      .limit(500)
      .get();

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  return [...localAlerts].reverse();
};

module.exports = {
  createAlert,
  getAlerts
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
