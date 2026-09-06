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
