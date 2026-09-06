require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt");

const app = express();

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = Number(process.env.PORT) || 5000;

const MAIN_BACKEND_URL =
    process.env.MAIN_BACKEND_URL || "http://localhost:5001";

const MQTT_BROKER_URL =
    process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";

const MQTT_SENSOR_TOPIC =
    process.env.MQTT_SENSOR_TOPIC ||
    "jalrakshak/device/+/sensors";

// ============================================================
// EXPRESS SETUP
// ============================================================

app.use(cors());

app.use(express.json({ limit: "1mb" }));

// ============================================================
// DATA DIRECTORY
// ============================================================

const dataDirectory = path.join(__dirname, "data");

const csvFile = path.join(
    dataDirectory,
    "live_sensor_data.csv"
);

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

if (!fs.existsSync(csvFile)) {
    fs.writeFileSync(
        csvFile,
        [
            "timestamp",
            "deviceId",
            "waterLevel",
            "rainfall",
            "temperature",
            "riseRate",
            "acceleration",
            "waterTrend",
            "sensorQuality",
            "latitude",
            "longitude"
        ].join(",") + "\n"
    );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function saveSensorDataToCSV(data) {
    try {
        const row = [
            data.timestamp || new Date().toISOString(),
            data.deviceId || "",
            data.waterLevel ?? "",
            data.rainfall ?? "",
            data.temperature ?? "",
            data.riseRate ?? "",
            data.acceleration ?? "",
            data.waterTrend || "",
            data.sensorQuality ?? "",
            data.latitude ?? "",
            data.longitude ?? ""
        ]
            .map(value => {
                const stringValue = String(value);

                if (
                    stringValue.includes(",") ||
                    stringValue.includes('"')
                ) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }

                return stringValue;
            })
            .join(",");

        fs.appendFileSync(
            csvFile,
            row + "\n"
        );

        return true;
    } catch (error) {
        console.error(
            "CSV save error:",
            error.message
        );

        return false;
    }
}

// ============================================================
// SENSOR DATA VALIDATION
// ============================================================

function validateSensorData(data) {
    const errors = [];

    if (!data.deviceId) {
        errors.push("deviceId is required");
    }

    if (
        data.waterLevel !== undefined &&
        typeof data.waterLevel !== "number"
    ) {
        errors.push("waterLevel must be a number");
    }

    if (
        data.rainfall !== undefined &&
        typeof data.rainfall !== "number"
    ) {
        errors.push("rainfall must be a number");
    }

    if (
        data.temperature !== undefined &&
        typeof data.temperature !== "number"
    ) {
        errors.push("temperature must be a number");
    }

    if (
        data.riseRate !== undefined &&
        typeof data.riseRate !== "number"
    ) {
        errors.push("riseRate must be a number");
    }

    if (
        data.acceleration !== undefined &&
        typeof data.acceleration !== "number"
    ) {
        errors.push("acceleration must be a number");
    }

    return errors;
}

// ============================================================
// MQTT CLIENT
// ============================================================

let mqttConnected = false;

const mqttClient = mqtt.connect(
    MQTT_BROKER_URL,
    {
        reconnectPeriod: 5000,
        connectTimeout: 10000,
        clean: true
    }
);

// ------------------------------------------------------------
// MQTT CONNECT
// ------------------------------------------------------------

mqttClient.on("connect", () => {
    mqttConnected = true;

    console.log("");
    console.log("======================================");
    console.log("       JAL-RAKSHAK MQTT GATEWAY");
    console.log("======================================");
    console.log(`MQTT Broker : ${MQTT_BROKER_URL}`);
    console.log(`Topic       : ${MQTT_SENSOR_TOPIC}`);
    console.log("MQTT Status : CONNECTED");
    console.log("======================================");
    console.log("");

    mqttClient.subscribe(
        MQTT_SENSOR_TOPIC,
        {
            qos: 1
        },
        (error) => {
            if (error) {
                console.error(
                    "MQTT subscription failed:",
                    error.message
                );

                return;
            }

            console.log(
                `Subscribed to MQTT topic: ${MQTT_SENSOR_TOPIC}`
            );
        }
    );
});

// ------------------------------------------------------------
// MQTT MESSAGE
// ------------------------------------------------------------

mqttClient.on(
    "message",
    async (topic, message) => {
        console.log("");
        console.log("======================================");
        console.log("        MQTT SENSOR MESSAGE");
        console.log("======================================");

        console.log("Topic:");
        console.log(topic);

        try {
            const rawMessage =
                message.toString();

            console.log("Payload:");
            console.log(rawMessage);

            // --------------------------------------------
            // Parse JSON
            // --------------------------------------------

            let sensorData;

            try {
                sensorData =
                    JSON.parse(rawMessage);
            } catch (error) {
                console.error(
                    "Invalid JSON received from MQTT device."
                );

                console.error(
                    error.message
                );

                return;
            }

            // --------------------------------------------
            // Timestamp
            // --------------------------------------------

            if (!sensorData.timestamp) {
                sensorData.timestamp =
                    new Date().toISOString();
            }

            // --------------------------------------------
            // Extract device ID from topic if missing
            // --------------------------------------------

            if (!sensorData.deviceId) {
                const topicParts =
                    topic.split("/");

                if (
                    topicParts.length >= 3 &&
                    topicParts[0] === "jalrakshak" &&
                    topicParts[1] === "device"
                ) {
                    sensorData.deviceId =
                        topicParts[2];
                }
            }

            // --------------------------------------------
            // Validate
            // --------------------------------------------

            const validationErrors =
                validateSensorData(
                    sensorData
                );

            if (validationErrors.length > 0) {
                console.error(
                    "Sensor validation failed:"
                );

                validationErrors.forEach(
                    error => {
                        console.error(
                            `- ${error}`
                        );
                    }
                );

                return;
            }

            // --------------------------------------------
            // Log sensor data
            // --------------------------------------------

            console.log("");
            console.log(
                "Device ID:",
                sensorData.deviceId
            );

            console.log(
                "Water Level:",
                sensorData.waterLevel
            );

            console.log(
                "Rainfall:",
                sensorData.rainfall
            );

            console.log(
                "Temperature:",
                sensorData.temperature
            );

            console.log(
                "Rise Rate:",
                sensorData.riseRate
            );

            console.log(
                "Water Trend:",
                sensorData.waterTrend
            );

            console.log(
                "Sensor Quality:",
                sensorData.sensorQuality
            );

            console.log(
                "Location:",
                sensorData.latitude,
                sensorData.longitude
            );

            // --------------------------------------------
            // Save local CSV backup
            // --------------------------------------------

            saveSensorDataToCSV(
                sensorData
            );

            console.log(
                "✓ Sensor data saved locally."
            );

            // --------------------------------------------
            // Forward to MAIN BACKEND
            // --------------------------------------------

            try {
                const backendResponse =
                    await axios.post(
                        `${MAIN_BACKEND_URL}/api/sensors`,
                        sensorData,
                        {
                            timeout: 5000,
                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                console.log(
                    "✓ Data forwarded to main backend."
                );

                if (
                    backendResponse.data
                ) {
                    console.log(
                        "Backend response:",
                        backendResponse.data
                    );
                }
            } catch (backendError) {
                console.error(
                    "✗ Failed to forward data to main backend."
                );

                if (
                    backendError.response
                ) {
                    console.error(
                        "Backend status:",
                        backendError.response.status
                    );

                    console.error(
                        "Backend response:",
                        backendError.response.data
                    );
                } else {
                    console.error(
                        backendError.message
                    );
                }
            }

            console.log("");
            console.log(
                "MQTT sensor processing completed."
            );

        } catch (error) {
            console.error(
                "MQTT processing error:",
                error.message
            );
        }

        console.log(
            "======================================"
        );
        console.log("");
    }
);

// ============================================================
// MQTT ERROR HANDLING
// ============================================================

mqttClient.on(
    "error",
    (error) => {
        mqttConnected = false;

        console.error(
            "MQTT Error:",
            error.message
        );
    }
);

mqttClient.on(
    "offline",
    () => {
        mqttConnected = false;

        console.log(
            "⚠ MQTT broker is offline."
        );
    }
);

mqttClient.on(
    "reconnect",
    () => {
        console.log(
            "↻ Attempting MQTT broker reconnection..."
        );
    }
);

mqttClient.on(
    "close",
    () => {
        mqttConnected = false;

        console.log(
            "MQTT connection closed."
        );
    }
);

// ============================================================
// HTTP HEALTH CHECK
// ============================================================

app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,
            service: "JAL-RAKSHAK MQTT Gateway",
            status: "online",
            port: PORT,
            mqtt: mqttConnected
                ? "connected"
                : "disconnected",
            mqttBroker: MQTT_BROKER_URL,
            mqttTopic: MQTT_SENSOR_TOPIC,
            mainBackend:
                MAIN_BACKEND_URL
        });
    }
);

// ============================================================
// GATEWAY HEALTH
// ============================================================

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            success: true,
            service:
                "JAL-RAKSHAK MQTT Gateway",
            status: "healthy",
            mqtt: {
                connected:
                    mqttConnected,
                broker:
                    MQTT_BROKER_URL,
                sensorTopic:
                    MQTT_SENSOR_TOPIC
            },
            backend: {
                url:
                    MAIN_BACKEND_URL
            },
            timestamp:
                new Date().toISOString()
        });
    }
);

// ============================================================
// DIRECT HTTP SENSOR ENDPOINT
// ============================================================
//
// We KEEP this endpoint for testing and backup.
// Real ESP32 communication will primarily use MQTT.
//

app.post(
    "/api/sensors",
    async (req, res) => {
        try {
            const sensorData = {
                ...req.body,
                timestamp:
                    req.body.timestamp ||
                    new Date().toISOString()
            };

            const errors =
                validateSensorData(
                    sensorData
                );

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid sensor data",
                    errors
                });
            }

            saveSensorDataToCSV(
                sensorData
            );

            try {
                const backendResponse =
                    await axios.post(
                        `${MAIN_BACKEND_URL}/api/sensors`,
                        sensorData,
                        {
                            timeout: 5000
                        }
                    );

                return res.json({
                    success: true,
                    source: "HTTP",
                    gateway: true,
                    backend:
                        backendResponse.data,
                    data: sensorData
                });
            } catch (backendError) {
                return res.status(502).json({
                    success: false,
                    message:
                        "Gateway received data but main backend is unavailable.",
                    error:
                        backendError.message,
                    data: sensorData
                });
            }
        } catch (error) {
            console.error(
                "HTTP sensor error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }
);

// ============================================================
// LATEST SENSOR DATA
// ============================================================

app.get(
    "/api/sensors/latest",
    (req, res) => {
        try {
            if (!fs.existsSync(csvFile)) {
                return res.json({
                    success: true,
                    data: null
                });
            }

            const content =
                fs.readFileSync(
                    csvFile,
                    "utf8"
                ).trim();

            if (!content) {
                return res.json({
                    success: true,
                    data: null
                });
            }

            const lines =
                content.split("\n");

            if (lines.length < 2) {
                return res.json({
                    success: true,
                    data: null
                });
            }

            const headers =
                lines[0].split(",");

            const latestLine =
                lines[lines.length - 1];

            const values =
                latestLine.split(",");

            const latestData = {};

            headers.forEach(
                (header, index) => {
                    latestData[header] =
                        values[index] ?? "";
                }
            );

            res.json({
                success: true,
                data: latestData
            });
        } catch (error) {
            console.error(
                "Latest sensor error:",
                error.message
            );

            res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }
);

// ============================================================
// MQTT STATUS ENDPOINT
// ============================================================

app.get(
    "/api/mqtt/status",
    (req, res) => {
        res.json({
            success: true,
            connected:
                mqttConnected,
            broker:
                MQTT_BROKER_URL,
            sensorTopic:
                MQTT_SENSOR_TOPIC,
            timestamp:
                new Date().toISOString()
        });
    }
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message:
                "Gateway route not found",
            path: req.originalUrl
        });
    }
);

// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {
        console.error(
            "Gateway server error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal server error"
        });
    }
);

// ============================================================
// START SERVER
// ============================================================

const server =
    app.listen(
        PORT,
        () => {
            console.log("");
            console.log(
                "======================================"
            );
            console.log(
                "      JAL-RAKSHAK GATEWAY SERVER"
            );
            console.log(
                "======================================"
            );

            console.log(
                `Gateway      : http://localhost:${PORT}`
            );

            console.log(
                `Health       : http://localhost:${PORT}/api/health`
            );

            console.log(
                `MQTT Status  : http://localhost:${PORT}/api/mqtt/status`
            );

            console.log(
                `Latest Data  : http://localhost:${PORT}/api/sensors/latest`
            );

            console.log(
                `Backend      : ${MAIN_BACKEND_URL}`
            );

            console.log(
                `MQTT Broker  : ${MQTT_BROKER_URL}`
            );

            console.log(
                `MQTT Topic   : ${MQTT_SENSOR_TOPIC}`
            );

            console.log(
                "Status       : ONLINE"
            );

            console.log(
                "======================================"
            );

            console.log("");
        }
    );

// ============================================================
// SERVER ERROR HANDLING
// ============================================================

server.on(
    "error",
    (error) => {
        if (
            error.code ===
            "EADDRINUSE"
        ) {
            console.error("");
            console.error(
                `ERROR: Port ${PORT} is already in use.`
            );
            console.error(
                "Stop the existing gateway server and try again."
            );
            console.error("");
        } else {
            console.error(
                "Gateway server error:",
                error
            );
        }
    }
);

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

function shutdown() {
    console.log("");
    console.log(
        "Shutting down JAL-RAKSHAK Gateway..."
    );

    mqttClient.end(
        false,
        () => {
            console.log(
                "MQTT connection closed."
            );

            server.close(
                () => {
                    console.log(
                        "Gateway server stopped."
                    );

                    process.exit(0);
                }
            );
        }
    );
}

process.on(
    "SIGINT",
    shutdown
);

process.on(
    "SIGTERM",
    shutdown
);