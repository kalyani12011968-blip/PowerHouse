function formatLLMResponse(text) {

    if (!text) {
        return {
            success: false,
            message: "No LLM response received"
        };
    }

    return {
        success: true,
        response: text.trim(),
        generatedAt: new Date().toISOString()
    };
}

module.exports = {
    formatLLMResponse
};