const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sensorRoutes = require("./routes/sensorRoutes");
const eventRoutes = require("./routes/eventRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const alertRoutes = require("./routes/alertRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "JAL-RAKSHAK",
        service: "Water Risk Intelligence Backend",
        status: "ONLINE"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/sensors", sensorRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/devices", deviceRoutes);

app.use("/api/alerts", alertRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("======================================");
    console.log("          JAL-RAKSHAK BACKEND");
    console.log("======================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Sensors: http://localhost:${PORT}/api/sensors`);
    console.log(`Events: http://localhost:${PORT}/api/events`);
    console.log(`Devices: http://localhost:${PORT}/api/devices`);
    console.log(`Alerts: http://localhost:${PORT}/api/alerts`);
    console.log("======================================");
});