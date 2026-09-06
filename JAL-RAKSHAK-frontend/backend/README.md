# JAL-RAKSHAK Backend

This backend handles sensor ingestion, water-behavior calculations, rule-based risk scoring, event classification, devices, alerts, authentication and optional Firebase Firestore storage.

AI and ML model code is intentionally excluded from this backend.

## Requirements

Node.js 18 or newer.

## Install

npm install

## Environment

Copy `.env.example` to `.env`.

PowerShell:

copy .env.example .env

For local development, Firebase variables can remain empty. The backend will use `data/sensorData.json` and in-memory devices/events/alerts.

## Run

npm run dev

or

npm start

## Health

GET http://localhost:5000/api/health

## Sensor API

POST /api/sensors

Example body:

{
  "deviceId": "JAL-001",
  "waterLevel": 43,
  "rainfall": 35,
  "temperature": 28,
  "latitude": 12.9716,
  "longitude": 77.5946,
  "sensorQuality": 1
}

GET /api/sensors/latest

GET /api/sensors/latest?deviceId=JAL-001

GET /api/sensors/history

GET /api/sensors/history?deviceId=JAL-001

## Device API

POST /api/devices

GET /api/devices

GET /api/devices/JAL-001

## Event API

POST /api/events

GET /api/events

GET /api/events/JAL-001

## Alert API

POST /api/alerts

GET /api/alerts

## Authentication API

POST /api/auth/register

POST /api/auth/login

The current authentication store is an in-memory development implementation. For production, connect it to Firebase Authentication or another persistent identity provider.

## Firebase

Set these values in `.env`:

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

When Firebase is configured, sensor readings, devices, events and alerts use Firestore where implemented.

Do not commit `.env` or private keys.

## Architecture

ESP32 -> POST /api/sensors -> validation -> sensor storage -> water behavior engine -> rule risk engine -> event classification -> dashboard/alerts

The AI/ML models can be integrated later without changing the sensor API contract.
