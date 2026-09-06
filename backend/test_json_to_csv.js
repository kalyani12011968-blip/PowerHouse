const {
    appendJsonToCsv,
    getCsvFilePath
} = require("./services/jsonToCsvService");

const sensorData = {
    deviceId: "ESP32-001",
    timestamp: new Date().toISOString(),

    waterLevel: 72.4,
    rainfall: 18.5,
    temperature: 29.3,

    riseRate: 2.4,
    acceleration: 0.6,

    waterTrend: "RISING",

    sensorQuality: 97,

    latitude: 12.9716,
    longitude: 77.5946
};

const result = appendJsonToCsv(
    sensorData
);

console.log("");
console.log("======================================");
console.log("       JSON → CSV TEST");
console.log("======================================");

console.log("Success:", result.success);
console.log("CSV File:", getCsvFilePath());

console.log("======================================");
console.log("");