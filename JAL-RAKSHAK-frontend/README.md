# JAL-RAKSHAK Frontend

Professional 2D React/Vite command center for **JAL-RAKSHAK — Water-Risk Intelligence & Early Warning System**.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo vs Live

Create `.env` from `.env.example`.

### Demo / hackathon mode

```env
VITE_USE_MOCK_DATA=true
```

The complete UI works without the backend. Use **Simulation Control** to demonstrate NORMAL, FLOOD ESCALATION, ABNORMAL WATER LOSS, and SENSOR ANOMALY.

### Live backend

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:5001/api
VITE_GATEWAY_URL=http://localhost:5000
```

The frontend never stores API keys or database credentials.

## Existing backend integration

Expected backend groups:

- `/api/sensors`
- `/api/events`
- `/api/devices`
- `/api/alerts`
- `/api/auth`
- `/api/ai`
- `/api/weather`

AI chat uses `POST /api/ai/chat`.

The realtime client is prepared for:

- `sensor:update`
- `risk:update`
- `event:new`
- `alert:new`
- `device:update`

## Architecture

```text
ESP32 → Gateway :5000 → Backend :5001 → Neon
                                  ↓
                        Water Behavior / AI / Weather
                                  ↓
                         Risk / Events / Alerts
                                  ↓
                         Socket.IO → Frontend :5173
```

## Notes

- The demo values are intentionally centralized in `src/services/mockData.js`.
- Demo data is visibly labelled **DEMO MODE** and is never presented as real sensor data.
- Prototype risk thresholds are UI/demo thresholds, not universal scientifically validated thresholds.
- Any ML performance shown in the UI is labelled as prototype/model-development evaluation based on synthetic data.
- “Abnormal water-loss behavior detected” is used instead of claiming definitive water theft.
