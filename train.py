import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, IsolationForest
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, mean_absolute_error, mean_squared_error, r2_score

DATASET = "jal_rakshak_synthetic_1M.csv"

df = pd.read_csv(DATASET)
df["timestamp"] = pd.to_datetime(df["timestamp"])
df = df.sort_values("timestamp").reset_index(drop=True)

df["hour"] = df["timestamp"].dt.hour
df["day"] = df["timestamp"].dt.day
df["month"] = df["timestamp"].dt.month
df["day_of_week"] = df["timestamp"].dt.dayofweek
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
df["water_level_change"] = df["water_level"].diff().fillna(0)
df["rainfall_change"] = df["rainfall"].diff().fillna(0)
df["rain_water_ratio"] = df["water_level_change"] / (df["rainfall"] + 0.001)
df["rapid_rise_flag"] = (df["rise_rate"] > 8).astype(int)
df["rapid_fall_flag"] = (df["rise_rate"] < -8).astype(int)
df["heavy_rain_flag"] = (df["rainfall"] > 20).astype(int)
df["level_ratio_to_max"] = df["water_level"] / (df["historical_max_level"] + 0.001)
df["rise_ratio_to_max"] = df["rise_rate"] / (df["historical_max_rise_rate"].abs() + 0.001)

trend_encoder = LabelEncoder()
df["water_trend_encoded"] = trend_encoder.fit_transform(df["water_trend"].astype(str))

device_encoder = LabelEncoder()
df["device_id_encoded"] = device_encoder.fit_transform(df["device_id"].astype(str))

features = [
    "water_level","rainfall","temperature","rise_rate","acceleration","sensor_quality",
    "historical_avg_level","historical_max_level","historical_avg_rise_rate",
    "historical_max_rise_rate","historical_avg_rainfall","level_deviation",
    "rise_rate_deviation","rainfall_deviation","water_trend_encoded","device_id_encoded",
    "hour","day","month","day_of_week","hour_sin","hour_cos","month_sin","month_cos",
    "water_level_change","rainfall_change","rain_water_ratio","rapid_rise_flag",
    "rapid_fall_flag","heavy_rain_flag","level_ratio_to_max","rise_ratio_to_max"
]

anomaly_features = [
    "water_level","rainfall","temperature","rise_rate","acceleration",
    "sensor_quality","level_deviation","rise_rate_deviation","rainfall_deviation"
]

X = df[features]
y_event = df["event"]
y_risk = df["risk_score"]

split = int(len(df) * 0.8)

X_train = X.iloc[:split]
X_test = X.iloc[split:]
y_event_train = y_event.iloc[:split]
y_event_test = y_event.iloc[split:]
y_risk_train = y_risk.iloc[:split]
y_risk_test = y_risk.iloc[split:]

event_model = RandomForestClassifier(
    n_estimators=150,
    max_depth=25,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
event_model.fit(X_train, y_event_train)

event_pred = event_model.predict(X_test)
print("Event Accuracy:", accuracy_score(y_event_test, event_pred))
print(classification_report(y_event_test, event_pred))

anomaly_model = IsolationForest(
    n_estimators=150,
    contamination=0.03,
    random_state=42,
    n_jobs=-1
)
anomaly_model.fit(X_train[anomaly_features])

anomaly_pred = anomaly_model.predict(X_test[anomaly_features])
actual_anomaly = (y_event_test == "SENSOR_ANOMALY").astype(int)
predicted_anomaly = (anomaly_pred == -1).astype(int)
print("Anomaly Confusion Matrix:")
print(confusion_matrix(actual_anomaly, predicted_anomaly))

risk_model = RandomForestRegressor(
    n_estimators=150,
    max_depth=25,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
risk_model.fit(X_train, y_risk_train)

risk_pred = np.clip(risk_model.predict(X_test), 0, 100)
mae = mean_absolute_error(y_risk_test, risk_pred)
rmse = np.sqrt(mean_squared_error(y_risk_test, risk_pred))
r2 = r2_score(y_risk_test, risk_pred)

print("Risk MAE:", mae)
print("Risk RMSE:", rmse)
print("Risk R2:", r2)

joblib.dump(event_model, "jal_rakshak_event_classifier.pkl")
joblib.dump(anomaly_model, "jal_rakshak_anomaly_detector.pkl")
joblib.dump(risk_model, "jal_rakshak_risk_model.pkl")
joblib.dump(trend_encoder, "water_trend_encoder.pkl")
joblib.dump(device_encoder, "device_encoder.pkl")
joblib.dump(features, "jal_rakshak_features.pkl")
joblib.dump(anomaly_features, "jal_rakshak_anomaly_features.pkl")

print("All models saved.")
