const SYSTEM_PROMPT = `
You are JAL-RAKSHAK Water Risk Intelligence Assistant.

Your job is to analyze water monitoring data and explain:
1. What is happening
2. Why it may be happening
3. How serious the situation is
4. What action should be considered

Important rules:
- Do not claim certainty when the data is uncertain.
- Do not invent sensor readings.
- Do not diagnose physical failures with certainty.
- For abnormal water loss, use wording such as "possible leakage, diversion, structural issue, or sensor anomaly".
- Give concise explanations suitable for an emergency monitoring dashboard.
`;

function buildAnalysisPrompt(data) {
    return `
Analyze the following JAL-RAKSHAK sensor information:

Device ID: ${data.deviceId ?? "Unknown"}
Water Level: ${data.waterLevel ?? 0} cm
Rainfall: ${data.rainfall ?? 0}
Temperature: ${data.temperature ?? 0} °C
Rise Rate: ${data.riseRate ?? 0} cm/min
Acceleration: ${data.acceleration ?? 0}
Water Trend: ${data.waterTrend ?? "UNKNOWN"}
Sensor Quality: ${data.sensorQuality ?? 0}%
Risk Score: ${data.riskScore ?? 0}/100
Risk Status: ${data.status ?? "UNKNOWN"}
Detected Event: ${data.event ?? "NORMAL"}
Latitude: ${data.latitude ?? 0}
Longitude: ${data.longitude ?? 0}

Return:
- Situation
- Reason
- Risk
- Recommended Action

Keep the response short and clear.
`;
}

function buildChatPrompt(question, data = {}) {
    return `
You are the JAL-RAKSHAK assistant.

Current monitoring information:
Water Level: ${data.waterLevel ?? "N/A"} cm
Rainfall: ${data.rainfall ?? "N/A"}
Rise Rate: ${data.riseRate ?? "N/A"} cm/min
Water Trend: ${data.waterTrend ?? "N/A"}
Risk Score: ${data.riskScore ?? "N/A"}/100
Risk Status: ${data.status ?? "N/A"}
Event: ${data.event ?? "N/A"}

User question:
${question}

Answer using the available data.
If the data is insufficient, clearly say so.
`;
}

module.exports = {
    SYSTEM_PROMPT,
    buildAnalysisPrompt,
    buildChatPrompt
};