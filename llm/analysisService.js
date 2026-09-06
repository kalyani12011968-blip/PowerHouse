const {
    SYSTEM_PROMPT,
    buildAnalysisPrompt
} = require("./promptTemplates");

const {
    formatLLMResponse
} = require("./responseFormatter");

async function analyzeWaterRisk(data) {

    const apiKey =
        process.env.OPENAI_API_KEY;

    /*
     * Demo fallback.
     *
     * If no LLM API key is configured,
     * the system still provides a useful
     * rule-based explanation.
     */

    if (!apiKey) {

        return formatLLMResponse(
            generateFallbackAnalysis(data)
        );
    }

    try {

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${apiKey}`
                },

                body: JSON.stringify({
                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5",

                    instructions:
                        SYSTEM_PROMPT,

                    input:
                        buildAnalysisPrompt(data)
                })
            }
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `LLM API error: ${errorText}`
            );
        }

        const result =
            await response.json();

        const text =
            result.output_text ||
            extractOutputText(result);

        return formatLLMResponse(text);

    } catch (error) {

        console.error(
            "LLM error:",
            error.message
        );

        return formatLLMResponse(
            generateFallbackAnalysis(data)
        );
    }
}


// ======================================
// FALLBACK ANALYSIS
// ======================================

function generateFallbackAnalysis(data) {

    const riskScore =
        Number(data.riskScore ?? 0);

    const waterLevel =
        Number(data.waterLevel ?? 0);

    const riseRate =
        Number(data.riseRate ?? 0);

    const rainfall =
        Number(data.rainfall ?? 0);

    const trend =
        data.waterTrend || "STABLE";

    const event =
        data.event || "NORMAL";

    let situation =
        "Water conditions are currently stable.";

    let reason =
        "No major abnormal water behavior detected.";

    let risk =
        "Current risk is low.";

    let action =
        "Continue monitoring.";

    // FLOOD

    if (
        event === "FLOOD_ESCALATION" ||
        riskScore >= 76
    ) {

        situation =
            "Rapidly increasing water risk detected.";

        reason =
            `Water level is ${waterLevel} cm with a rise rate of ${riseRate} cm/min. ` +
            `Rainfall is ${rainfall}.`;

        risk =
            `Risk score is ${riskScore}/100 and is classified as CRITICAL.`;

        action =
            "Issue an urgent warning, verify the sensor reading, and prepare for immediate local response.";
    }

    // WARNING

    else if (riskScore >= 51) {

        situation =
            "Elevated water risk detected.";

        reason =
            `Current water level is ${waterLevel} cm and the water trend is ${trend}.`;

        risk =
            `Risk score is ${riskScore}/100 and requires attention.`;

        action =
            "Continue close monitoring and prepare an alert if the water level continues to rise.";
    }

    // ABNORMAL WATER LOSS

    else if (
        event === "ABNORMAL_WATER_LOSS"
    ) {

        situation =
            "Abnormal water-level decrease detected.";

        reason =
            `The water level is falling at approximately ${Math.abs(riseRate)} cm/min.`;

        risk =
            `Risk score is ${riskScore}/100. The change may indicate possible leakage, diversion, structural issues, or sensor anomaly.`;

        action =
            "Inspect the monitoring location and verify the sensor before taking corrective action.";
    }

    // SENSOR ANOMALY

    else if (
        event === "SENSOR_ANOMALY"
    ) {

        situation =
            "Possible sensor anomaly detected.";

        reason =
            `Sensor quality is ${data.sensorQuality ?? "unknown"}%.`;

        risk =
            "The reported water behavior may be unreliable.";

        action =
            "Inspect the sensor and verify the reading using another measurement source.";
    }

    return `
Situation:
${situation}

Reason:
${reason}

Risk:
${risk}

Recommended Action:
${action}
`;
}


// ======================================
// EXTRACT OPENAI RESPONSE
// ======================================

function extractOutputText(result) {

    if (
        !result ||
        !Array.isArray(result.output)
    ) {
        return "";
    }

    let text = "";

    for (const item of result.output) {

        if (
            item.content &&
            Array.isArray(item.content)
        ) {

            for (const content of item.content) {

                if (
                    content.type ===
                    "output_text"
                ) {

                    text +=
                        content.text || "";
                }
            }
        }
    }

    return text;
}

module.exports = {
    analyzeWaterRisk
};