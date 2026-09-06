<<<<<<< HEAD
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// ============================================
// ROUTES
// ============================================
=======
const express = require("express");
const cors = require("cors");
require("dotenv").config();
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5

const sensorRoutes = require("./routes/sensorRoutes");
const eventRoutes = require("./routes/eventRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");
<<<<<<< HEAD
const aiRoutes = require("./routes/aiRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

// ============================================
// REAL EXTERNAL SENSOR SERVICE
// ============================================

const {
    getExternalSensorData
} = require("./services/externalSensorService");

// ============================================
// APP CONFIGURATION
// ============================================

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
    })
);

app.use(express.json());

// ============================================
// ROOT
// ============================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        service: "JAL-RAKSHAK Main Backend",
        status: "running",
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "main-backend",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// ============================================
// API ROUTES
// ============================================

=======
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/auth", authRoutes);
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
app.use("/api/sensors", sensorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/alerts", alertRoutes);
<<<<<<< HEAD
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);

// ============================================
// EXTERNAL REAL SENSOR DATA
// ============================================

app.get("/api/external-sensors", async (req, res) => {
    try {
        const data = await getExternalSensorData();

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error(
            "External sensor error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to read external sensor website",
            error: error.message
        });
    }
});

// ============================================
// AUTOMATIC REAL SENSOR POLLING
// ============================================

const SENSOR_POLL_INTERVAL = 3000;

let latestExternalSensorData = null;

async function pollExternalSensor() {
    try {
        const data = await getExternalSensorData();

        latestExternalSensorData = data;

        console.log("\n========================================");
        console.log("REAL SENSOR DATA RECEIVED");
        console.log("========================================");
        console.log("Device ID    :", data.deviceId);
        console.log("Water Level  :", data.waterLevel, "cm");
        console.log("Raw Distance :", data.rawDistance, "cm");
        console.log("Temperature  :", data.temperature, "°C");
        console.log("Rain Status  :", data.rainStatus);
        console.log("Rise Rate    :", data.riseRate, "cm/s");
        console.log("Risk Status  :", data.riskStatus);
        console.log("Risk Score   :", data.riskScore);
        console.log("Timestamp    :", data.timestamp);
        console.log("========================================");

        // Send live data to connected React clients
        io.emit("sensorData", data);

    } catch (error) {
        console.error(
            "Real sensor polling error:",
            error.message
        );
    }
}

// Start polling every 3 seconds
setInterval(
    pollExternalSensor,
    SENSOR_POLL_INTERVAL
);

// ============================================
// LATEST SENSOR DATA ENDPOINT
// ============================================

app.get("/api/external-sensors/latest", (req, res) => {
    if (!latestExternalSensorData) {
        return res.status(404).json({
            success: false,
            message: "No external sensor data received yet"
        });
    }

    res.json({
        success: true,
        data: latestExternalSensorData
    });
});

// ============================================
// SOCKET.IO
// ============================================

io.on("connection", (socket) => {
    console.log(
        "Frontend connected:",
        socket.id
    );

    // Send latest sensor data immediately
    if (latestExternalSensorData) {
        socket.emit(
            "sensorData",
            latestExternalSensorData
        );
    }

    socket.on("disconnect", () => {
        console.log(
            "Frontend disconnected:",
            socket.id
        );
    });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
    console.error("Backend error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});

// ============================================
// START SERVER
// ============================================

server.listen(PORT, () => {
    console.log("");
    console.log("========================================");
    console.log("       JAL-RAKSHAK MAIN BACKEND");
    console.log("========================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(
        `External Sensor: http://localhost:${PORT}/api/external-sensors`
    );
    console.log(
        `Latest Sensor: http://localhost:${PORT}/api/external-sensors/latest`
    );
    console.log(
        `Sensor Source: http://10.93.146.59/`
    );
    console.log(
        `Polling interval: ${SENSOR_POLL_INTERVAL} ms`
    );
    console.log("========================================");
    console.log("");
});
=======

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("======================================");
  console.log("          JAL-RAKSHAK BACKEND");
  console.log("======================================");
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("======================================");
});
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
