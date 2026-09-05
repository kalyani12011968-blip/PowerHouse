const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sensorRoutes = require("./routes/sensorRoutes");
const eventRoutes = require("./routes/eventRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");
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
app.use("/api/sensors", sensorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/alerts", alertRoutes);

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
