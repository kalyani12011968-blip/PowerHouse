const MAIN_BACKEND = "http://localhost:5001";
const GATEWAY = "http://localhost:5000";


// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function request(
    name,
    url,
    options = {}
) {
    try {

        const response =
            await fetch(url, options);

        const text =
            await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        console.log(
            `\n[PASS] ${name}`
        );

        console.log(
            "Status:",
            response.status
        );

        return {
            success: response.ok,
            status: response.status,
            data
        };

    } catch (error) {

        console.log(
            `\n[FAIL] ${name}`
        );

        console.log(
            "Error:",
            error.message
        );

        return {
            success: false,
            error: error.message
        };
    }
}


// ==========================================
// TEST 1 - MAIN BACKEND
// ==========================================

async function testMainBackend() {

    return await request(
        "Main Backend Health",
        `${MAIN_BACKEND}/api/health`
    );
}


// ==========================================
// TEST 2 - GATEWAY
// ==========================================

async function testGateway() {

    return await request(
        "Real-Time Gateway Health",
        `${GATEWAY}/api/health`
    );
}


// ==========================================
// TEST 3 - SEND SENSOR DATA
// ==========================================

async function testSensorData() {

    const sensorData = {

        deviceId: "ESP32-TEST-001",

        waterLevel: 72.5,

        rainfall: 18.4,

        temperature: 29.2,

        riseRate: 1.8,

        acceleration: 0.35,

        waterTrend: "RISING",

        sensorQuality: 98,

        latitude: 12.9716,

        longitude: 77.5946
    };

    return await request(

        "ESP32 Sensor Data → Gateway",

        `${GATEWAY}/api/sensors`,

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(sensorData)
        }
    );
}


// ==========================================
// TEST 4 - LATEST GATEWAY DATA
// ==========================================

async function testLatestSensor() {

    return await request(

        "Latest Sensor Data",

        `${GATEWAY}/api/sensors/latest`
    );
}


// ==========================================
// TEST 5 - MAIN BACKEND SENSOR DATA
// ==========================================

async function testBackendSensor() {

    return await request(

        "Main Backend Sensor History",

        `${MAIN_BACKEND}/api/sensors/history`
    );
}


// ==========================================
// TEST 6 - DEVICES
// ==========================================

async function testDevices() {

    return await request(

        "Device API",

        `${MAIN_BACKEND}/api/devices`
    );
}


// ==========================================
// TEST 7 - EVENTS
// ==========================================

async function testEvents() {

    return await request(

        "Event API",

        `${MAIN_BACKEND}/api/events`
    );
}


// ==========================================
// TEST 8 - ALERTS
// ==========================================

async function testAlerts() {

    return await request(

        "Alert API",

        `${MAIN_BACKEND}/api/alerts`
    );
}


// ==========================================
// TEST 9 - AI / ML
// ==========================================

async function testAI() {

    const data = {

        deviceId: "ESP32-TEST-001",

        waterLevel: 91,

        rainfall: 62,

        temperature: 29,

        riseRate: 7.2,

        acceleration: 1.4,

        waterTrend: "RAPID_RISE",

        sensorQuality: 98,

        latitude: 12.9716,

        longitude: 77.5946
    };

    return await request(

        "AI / ML Prediction",

        `${MAIN_BACKEND}/api/ai/predict`,

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(data)
        }
    );
}


// ==========================================
// TEST 10 - LLM ANALYSIS
// ==========================================

async function testLLM() {

    const data = {

        deviceId: "ESP32-TEST-001",

        waterLevel: 91,

        rainfall: 62,

        temperature: 29,

        riseRate: 7.2,

        acceleration: 1.4,

        waterTrend: "RAPID_RISE",

        sensorQuality: 98,

        riskScore: 88,

        status: "CRITICAL",

        event: "FLOOD_ESCALATION",

        latitude: 12.9716,

        longitude: 77.5946
    };

    return await request(

        "LLM Water Risk Analysis",

        `${MAIN_BACKEND}/api/ai/analyze`,

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(data)
        }
    );
}


// ==========================================
// TEST 11 - LLM CHATBOT
// ==========================================

async function testChatbot() {

    const body = {

        question:
            "Why is the current water risk high?",

        sensorData: {

            waterLevel: 91,

            rainfall: 62,

            riseRate: 7.2,

            waterTrend:
                "RAPID_RISE",

            riskScore: 88,

            status: "CRITICAL",

            event:
                "FLOOD_ESCALATION"
        }
    };

    return await request(

        "LLM Chatbot",

        `${MAIN_BACKEND}/api/ai/chat`,

        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(body)
        }
    );
}


// ==========================================
// RUN ALL TESTS
// ==========================================

async function runTests() {

    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "      JAL-RAKSHAK INTEGRATION TEST"
    );

    console.log(
        "=========================================="
    );

    console.log(
        "Main Backend:",
        MAIN_BACKEND
    );

    console.log(
        "Gateway:",
        GATEWAY
    );

    console.log(
        "=========================================="
    );


    // Backend

    await testMainBackend();


    // Gateway

    await testGateway();


    // Sensor

    await testSensorData();


    // Latest sensor

    await testLatestSensor();


    // Backend history

    await testBackendSensor();


    // Devices

    await testDevices();


    // Events

    await testEvents();


    // Alerts

    await testAlerts();


    // AI

    await testAI();


    // LLM

    await testLLM();


    // Chatbot

    await testChatbot();


    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "       INTEGRATION TEST COMPLETE"
    );

    console.log(
        "=========================================="
    );
}


runTests();