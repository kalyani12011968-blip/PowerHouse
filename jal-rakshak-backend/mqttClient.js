const mqtt = require("mqtt");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const MQTT_SENSOR_TOPIC =
    process.env.MQTT_SENSOR_TOPIC || "jalrakshak/device/+/sensors";

const MAIN_BACKEND_URL =
    process.env.MAIN_BACKEND_URL || "http://localhost:5001";

const client = mqtt.connect(MQTT_BROKER_URL);

const dataDirectory = path.join(__dirname, "data");
const csvFile = path.join(dataDirectory, "live_sensor_data.csv");

function ensureDataDirectory() {
    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
    }

    if (!fs.existsSync(csvFile)) {
        fs.writeFileSync(
            csvFile,
            "timestamp,deviceId,waterLevel,rainfall,temperature,riseRate,acceleration,waterTrend,sensorQuality,latitude,longitude\n"
        );
    }
}

function saveToCSV(data) {
    ensureDataDirectory();

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
    ].join(",");

    fs.appendFileSync(csvFile, row + "\n");
}

client.on("connect", () => {
    console.log("");
    console.log("======================================");
    console.log("       JAL-RAKSHAK MQTT GATEWAY");
    console.log("======================================");
    console.log(`MQTT Broker: ${MQTT_BROKER_URL}`);
    console.log(`Sensor Topic: ${MQTT_SENSOR_TOPIC}`);
    console.log("Status: CONNECTED");
    console.log("======================================");
    console.log("");

    client.subscribe(MQTT_SENSOR_TOPIC, (error) => {
        if (error) {
            console.error("MQTT subscription failed:", error.message);
            return;
        }

        console.log(`Subscribed to: ${MQTT_SENSOR_TOPIC}`);
    });
});

client.on("message", async (topic, message) => {
    try {
        const rawMessage = message.toString();

        console.log("");
        console.log("========== MQTT SENSOR DATA ==========");
        console.log("Topic:", topic);
        console.log("Message:", rawMessage);

        const data = JSON.parse(rawMessage);

        data.timestamp = data.timestamp || new Date().toISOString();

        saveToCSV(data);

        console.log("Device:", data.deviceId);
        console.log("Water Level:", data.waterLevel);
        console.log("Rainfall:", data.rainfall);
        console.log("Temperature:", data.temperature);

        await axios.post(
            `${MAIN_BACKEND_URL}/api/sensors`,
            data,
            {
                timeout: 5000
            }
        );

        console.log("Forwarded to main backend successfully.");
        console.log("======================================");
    } catch (error) {
        console.error("");
        console.error("MQTT processing error:", error.message);
        console.error("");
    }
});

client.on("error", (error) => {
    console.error("MQTT error:", error.message);
});

client.on("reconnect", () => {
    console.log("MQTT reconnecting...");
});

client.on("offline", () => {
    console.log("MQTT broker offline.");
});

module.exports = client;