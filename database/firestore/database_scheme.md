# JAL-RAKSHAK Firestore Database Architecture

## Root Database

jal-rakshak

│
├── devices
│   └── ESP32-001
│       ├── deviceName
│       ├── latitude
│       ├── longitude
│       ├── location
│       ├── status
│       └── lastSeen
│
├── sensorReadings
│   └── readingId
│       ├── deviceId
│       ├── timestamp
│       ├── waterLevel
│       ├── rainfall
│       ├── temperature
│       ├── riseRate
│       ├── acceleration
│       ├── waterTrend
│       └── sensorQuality
│
├── events
│   └── eventId
│       ├── deviceId
│       ├── event
│       ├── riskScore
│       ├── confidence
│       ├── timestamp
│       ├── latitude
│       └── longitude
│
├── alerts
│   └── alertId
│       ├── deviceId
│       ├── type
│       ├── severity
│       ├── message
│       ├── sentAt
│       └── status
│
├── weather
│   └── weatherId
│       ├── deviceId
│       ├── rainfallForecast
│       ├── temperature
│       ├── precipitationProbability
│       └── timestamp
│
└── predictions
    └── predictionId
        ├── deviceId
        ├── predictedEvent
        ├── riskScore
        ├── confidence
        ├── timestamp
        └── modelVersion