const fs = require("fs");
const path = require("path");

const CSV_DIR = path.join(__dirname, "..", "data");
const CSV_FILE = path.join(CSV_DIR, "sensor_readings.csv");

const CSV_HEADERS = [
    "deviceId",
    "timestamp",
    "waterLevel",
    "rainfall",
    "temperature",
    "riseRate",
    "acceleration",
    "waterTrend",
    "sensorQuality",
    "latitude",
    "longitude"
];

/*
========================================
CREATE CSV FILE IF IT DOES NOT EXIST
========================================
*/

function initializeCsv() {

    if (!fs.existsSync(CSV_DIR)) {
        fs.mkdirSync(CSV_DIR, {
            recursive: true
        });
    }

    if (!fs.existsSync(CSV_FILE)) {

        fs.writeFileSync(
            CSV_FILE,
            CSV_HEADERS.join(",") + "\n",
            "utf8"
        );

        console.log(
            "Created sensor CSV:",
            CSV_FILE
        );
    }
}


/*
========================================
ESCAPE CSV VALUE
========================================
*/

function escapeCsvValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(
            /"/g,
            '""'
        )}"`;
    }

    return stringValue;
}


/*
========================================
CONVERT JSON OBJECT TO CSV ROW
========================================
*/

function jsonToCsvRow(data) {

    return CSV_HEADERS
        .map((header) => {
            return escapeCsvValue(
                data[header]
            );
        })
        .join(",");
}


/*
========================================
APPEND JSON READING TO CSV
========================================
*/

function appendJsonToCsv(data) {

    initializeCsv();

    const row = jsonToCsvRow(data);

    fs.appendFileSync(
        CSV_FILE,
        row + "\n",
        "utf8"
    );

    return {
        success: true,
        file: CSV_FILE,
        row: data
    };
}


/*
========================================
GET CSV FILE PATH
========================================
*/

function getCsvFilePath() {
    return CSV_FILE;
}


/*
========================================
EXPORT
========================================
*/

module.exports = {
    initializeCsv,
    jsonToCsvRow,
    appendJsonToCsv,
    getCsvFilePath
};