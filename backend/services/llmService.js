const {
    analyzeWaterRisk
} = require("C:\\JAL-RAKSHAK\\JAL-RAKSHAK\\llm\\analysisService.js");

const {
    askAssistant
} = require("C:\\JAL-RAKSHAK\\JAL-RAKSHAK\\llm\\chatbotService.js");

async function analyze(data) {

    return await analyzeWaterRisk(data);
}

async function chat(
    question,
    data
) {

    return await askAssistant(
        question,
        data
    );
}

module.exports = {
    analyze,
    chat
};