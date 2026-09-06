const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = 5173;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// SERVE FRONTEND FILES
// ========================================

app.use(express.static(__dirname));

// ========================================
// FRONTEND HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "JAL-RAKSHAK Frontend",
        status: "healthy",
        frontend: `http://localhost:${PORT}`,
        backend: "http://localhost:5001",
        gateway: "http://localhost:5000"
    });
});

// ========================================
// FRONTEND PAGE
// ========================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
    console.error("Frontend server error:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

// ========================================
// START SERVER
// ========================================

const server = app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("       JAL-RAKSHAK FRONTEND");
    console.log("======================================");
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log("Backend:  http://localhost:5001");
    console.log("Gateway:  http://localhost:5000");
    console.log("Status:   ONLINE");
    console.log("======================================");
    console.log("");

});

server.on("error", (error) => {

    if (error.code === "EADDRINUSE") {
        console.error("");
        console.error("ERROR: Port 5173 is already in use.");
        console.error("Close the existing frontend server and run npm run dev again.");
        console.error("");
    } else {
        console.error("Frontend server error:", error);
    }

});