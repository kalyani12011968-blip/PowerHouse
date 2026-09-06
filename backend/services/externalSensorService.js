const axios = require("axios");

const SENSOR_WEBSITE_URL = "http://10.93.146.59/";

async function getExternalSensorData() {
    const response = await axios.get(SENSOR_WEBSITE_URL, {
        timeout: 15000
    });

    const html = response.data;

    const extract = (regex) => {
        const match = html.match(regex);
        return match ? match[1].trim() : null;
    };

    const waterLevel = extract(
        /Water Level<\/div><div class='value'>([-\d.]+)\s*cm/
    );

    const rawDistance = extract(
        /Raw Distance \(HC-SR04\)<\/div><div class='value'>([-\d.]+)\s*cm/
    );

    const temperature = extract(
        /Temperature<\/div><div class='value'>([-\d.]+)\s*&deg;C/
    );

    const rainStatus = extract(
        /Rain Status<\/div><div class='value'>(.*?)<\/div>/
    );

    const riseRate = extract(
        /Water Level Rate of Change<\/div><div class='value'>([-\d.]+)\s*cm\/s/
    );

    const riskMatch = html.match(
        /<span class='risk'>(.*?)\s*\(([-\d.]+)\/100\)<\/span>/
    );

    return {
        deviceId: "ESP32-001",
        waterLevel: waterLevel !== null ? Number(waterLevel) : null,
        rawDistance: rawDistance !== null ? Number(rawDistance) : null,
        temperature: temperature !== null ? Number(temperature) : null,
        rainStatus,
        riseRate: riseRate !== null ? Number(riseRate) : null,
        riskStatus: riskMatch ? riskMatch[1].trim() : null,
        riskScore: riskMatch ? Number(riskMatch[2]) : null,
        source: SENSOR_WEBSITE_URL,
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    getExternalSensorData
};