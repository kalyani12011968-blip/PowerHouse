import pandas as pd
import numpy as np
import joblib

event_model = joblib.load("jal_rakshak_event_classifier.pkl")
anomaly_model = joblib.load("jal_rakshak_anomaly_detector.pkl")
risk_model = joblib.load("jal_rakshak_risk_model.pkl")
trend_encoder = joblib.load("water_trend_encoder.pkl")
device_encoder = joblib.load("device_encoder.pkl")
features = joblib.load("jal_rakshak_features.pkl")
anomaly_features = joblib.load("jal_rakshak_anomaly_features.pkl")

def risk_status(score):
    if score <= 25:
        return "SAFE"
    if score <= 50:
        return "WATCH"
    if score <= 75:
        return "WARNING"
    return "CRITICAL"

def predict(data):
    x = pd.DataFrame([data])
    t = pd.to_datetime(data["timestamp"])

    trend = data["water_trend"]
    x["water_trend_encoded"] = trend_encoder.transform([trend])[0] if trend in trend_encoder.classes_ else 0

    device = data["device_id"]
    x["device_id_encoded"] = device_encoder.transform([device])[0] if device in device_encoder.classes_ else 0

    x["hour"] = t.hour
    x["day"] = t.day
    x["month"] = t.month
    x["day_of_week"] = t.dayofweek
    x["hour_sin"] = np.sin(2 * np.pi * t.hour / 24)
    x["hour_cos"] = np.cos(2 * np.pi * t.hour / 24)
    x["month_sin"] = np.sin(2 * np.pi * t.month / 12)
    x["month_cos"] = np.cos(2 * np.pi * t.month / 12)

    x["water_level_change"] = data.get("water_level_change", 0)
    x["rainfall_change"] = data.get("rainfall_change", 0)
    x["rain_water_ratio"] = data.get("water_level_change", 0) / (data["rainfall"] + 0.001)
    x["rapid_rise_flag"] = int(data["rise_rate"] > 8)
    x["rapid_fall_flag"] = int(data["rise_rate"] < -8)
    x["heavy_rain_flag"] = int(data["rainfall"] > 20)
    x["level_ratio_to_max"] = data["water_level"] / (data["historical_max_level"] + 0.001)
    x["rise_ratio_to_max"] = data["rise_rate"] / (abs(data["historical_max_rise_rate"]) + 0.001)

    x = x[features]

    event = event_model.predict(x)[0]
    risk = float(np.clip(risk_model.predict(x)[0], 0, 100))
    anomaly = bool(anomaly_model.predict(x[anomaly_features])[0] == -1)

    return {
        "event": event,
        "risk_score": round(risk, 2),
        "status": risk_status(risk),
        "sensor_anomaly": anomaly
    }

if __name__ == "__main__":
    sample = {
        "timestamp": "2026-09-05 14:00:00",
        "device_id": "JAL-001",
        "water_level": 180,
        "rainfall": 45,
        "temperature": 27,
        "rise_rate": 12,
        "acceleration": 4,
        "water_trend": "RAPID_RISE",
        "sensor_quality": 0.98,
        "historical_avg_level": 120,
        "historical_max_level": 200,
        "historical_avg_rise_rate": 2,
        "historical_max_rise_rate": 10,
        "historical_avg_rainfall": 5,
        "level_deviation": 60,
        "rise_rate_deviation": 10,
        "rainfall_deviation": 40,
        "water_level_change": 3,
        "rainfall_change": 20
    }
    print(predict(sample))
