# JAL-RAKSHAK Database Schema

## sensors

| Field | Type | Description |
|---|---|---|
| deviceId | string | ESP32 device ID |
| timestamp | timestamp/string | Reading time |
| waterLevel | number | Current water level |
| rainfall | number | Rainfall measurement |
| temperature | number | Temperature |
| riseRate | number | Water-level rise rate |
| acceleration | number | Change in rise rate |
| waterTrend | string | STABLE/RISING/RAPID_RISE/FALLING |
| sensorQuality | number | Sensor quality percentage |
| latitude | number | GPS latitude |
| longitude | number | GPS longitude |
| riskScore | number | 0-100 risk score |
| status | string | SAFE/WATCH/WARNING/CRITICAL |

---

## events

| Field | Type | Description |
|---|---|---|
| eventId | string | Unique event ID |
| deviceId | string | Source device |
| type | string | Event type |
| riskScore | number | Risk score |
| timestamp | timestamp/string | Event time |
| description | string | Event explanation |
| status | string | ACTIVE/ACKNOWLEDGED/RESOLVED |

---

## devices

| Field | Type | Description |
|---|---|---|
| deviceId | string | Unique ESP32 ID |
| name | string | Device name |
| location | string | Device location |
| latitude | number | GPS latitude |
| longitude | number | GPS longitude |
| status | string | ONLINE/OFFLINE |
| lastHeartbeat | timestamp/string | Last device heartbeat |

---

## alerts

| Field | Type | Description |
|---|---|---|
| alertId | string | Unique alert ID |
| deviceId | string | Source device |
| type | string | Alert type |
| severity | string | WARNING/CRITICAL |
| riskScore | number | Risk score |
| message | string | Alert message |
| status | string | ACTIVE/ACKNOWLEDGED/RESOLVED |
| createdAt | timestamp/string | Creation time |

---

## users

| Field | Type | Description |
|---|---|---|
| userId | string | User ID |
| name | string | User name |
| email | string | Email |
| role | string | ADMIN/OPERATOR/VIEWER |
| createdAt | timestamp/string | Account creation time |