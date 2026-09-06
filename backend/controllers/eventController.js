<<<<<<< HEAD
const {
    getEvents
} = require("../services/eventService");

function listEvents(req, res) {

    res.json({
        success: true,
        data: getEvents()
    });
}

module.exports = {
    listEvents
};
=======
const { db } = require("../config/firebase");
const { createEventRecord } = require("../services/eventService");

const localEvents = [];

const createEvent = async (req, res, next) => {
  try {
    const event = createEventRecord(req.body);

    if (db) {
      const ref = await db.collection("events").add(event);
      event.id = ref.id;
    } else {
      localEvents.push(event);
    }

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    if (db) {
      let query = db
        .collection("events")
        .orderBy("timestamp", "desc")
        .limit(500);

      if (req.query.deviceId) {
        query = db
          .collection("events")
          .where("deviceId", "==", req.query.deviceId)
          .orderBy("timestamp", "desc")
          .limit(500);
      }

      const snap = await query.get();

      return res.json({
        success: true,
        count: snap.size,
        data: snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      });
    }

    const data = [...localEvents]
      .filter(
        (event) =>
          !req.query.deviceId ||
          event.deviceId === req.query.deviceId
      )
      .reverse();

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    if (db) {
      const doc = await db
        .collection("events")
        .doc(req.params.id)
        .get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Event not found"
        });
      }

      return res.json({
        success: true,
        data: {
          id: doc.id,
          ...doc.data()
        }
      });
    }

    const event = localEvents.find(
      (item) => item.id === req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
