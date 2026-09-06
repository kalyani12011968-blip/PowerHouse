// ==========================================
// JAL-RAKSHAK DATABASE SEED
// ==========================================

const fs = require("fs");
const path = require("path");

// ==========================================
// SAMPLE DATA
// ==========================================

const deviceData = [
    {
        deviceId: "ESP32-001",
        name: "River Monitor 01",
        location: "Chennai",
        latitude: 13.0827,
        longitude: 80.2707,
        status: "ONLINE",
        lastHeartbeat: new Date().toISOString()
    }
];

const sensorData = [
    {
        deviceId: "ESP32-001",
        timestamp: new Date().toISOString(),

        waterLevel: 72.5,
        rainfall: 18.4,
        temperature: 29.2,

        riseRate: 1.8,
        acceleration: 0.35,

        waterTrend: "RISING",

        sensorQuality: 98,

        latitude: 13.0827,
        longitude: 80.2707,

        riskScore: 64,
        status: "WARNING"
    }
];

const eventData = [
    {
        eventId: `EVT-${Date.now()}`,

        deviceId: "ESP32-001",

        type: "FLOOD_ESCALATION",

        riskScore: 64,

        timestamp: new Date().toISOString(),

        description:
            "Water level is rising and requires monitoring.",

        status: "ACTIVE"
    }
];

const alertData = [
    {
        alertId: `ALT-${Date.now()}`,

        deviceId: "ESP32-001",

        type: "FLOOD_ESCALATION",

        severity: "WARNING",

        riskScore: 64,

        message:
            "Water level rising. Monitor the location.",

        status: "ACTIVE",

        createdAt: new Date().toISOString()
    }
];

const userData = [
    {
        userId: "admin",

        name: "JAL-RAKSHAK Admin",

        email: "admin@jalrakshak.com",

        role: "ADMIN",

        createdAt: new Date().toISOString()
    }
];

// ==========================================
// LOCAL DATABASE PATHS
// ==========================================

const projectRoot = path.resolve(__dirname, "../..");

const dataDirectory = path.join(
    projectRoot,
    "backend",
    "data"
);

// Create backend/data if it doesn't exist
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
        recursive: true
    });
}

// ==========================================
// SAVE JSON FUNCTION
// ==========================================

function saveJSON(filename, data) {

    const filePath = path.join(
        dataDirectory,
        filename
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        "utf8"
    );

    console.log(`✓ Created ${filename}`);
}

// ==========================================
// SEED DATABASE
// ==========================================

function seedDatabase() {

    console.log("");
    console.log("==========================================");
    console.log("      JAL-RAKSHAK DATABASE SEED");
    console.log("==========================================");
    console.log("");

    try {

        // Devices
        saveJSON(
            "devices.json",
            deviceData
        );

        // Sensor readings
        saveJSON(
            "sensorData.json",
            sensorData
        );

        // Events
        saveJSON(
            "events.json",
            eventData
        );

        // Alerts
        saveJSON(
            "alerts.json",
            alertData
        );

        // Users
        saveJSON(
            "users.json",
            userData
        );

        console.log("");
        console.log("==========================================");
        console.log("✓ DATABASE SEED COMPLETED");
        console.log("==========================================");
        console.log("");

        console.log("Database files created at:");
        console.log(dataDirectory);

        console.log("");
        console.log("Collections seeded:");
        console.log("✓ devices");
        console.log("✓ sensors");
        console.log("✓ events");
        console.log("✓ alerts");
        console.log("✓ users");

        console.log("");

    } catch (error) {

        console.error("");
        console.error("❌ DATABASE SEED FAILED");
        console.error("");
        console.error(error.message);
        console.error("");

    }
}

// ==========================================
// RUN
// ==========================================

seedDatabase();