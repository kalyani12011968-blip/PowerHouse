import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from xgboost import XGBClassifier, XGBRegressor

from src.feature_engineering import create_features


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "jal_rakshak_synthetic_1M.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

RESULTS_DIR = os.path.join(
    BASE_DIR,
    "results"
)

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


# ============================================================
# MODEL FILES
# ============================================================

EVENT_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "event_classifier.joblib"
)

EVENT_ENCODER_PATH = os.path.join(
    MODEL_DIR,
    "event_label_encoder.joblib"
)

EVENT_FEATURES_PATH = os.path.join(
    MODEL_DIR,
    "event_features.joblib"
)

RISK_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "risk_model.joblib"
)

RISK_FEATURES_PATH = os.path.join(
    MODEL_DIR,
    "risk_features.joblib"
)


# ============================================================
# RESULT FILES
# ============================================================

METRICS_PATH = os.path.join(
    RESULTS_DIR,
    "metrics.json"
)

CLASSIFICATION_REPORT_PATH = os.path.join(
    RESULTS_DIR,
    "classification_report.json"
)

CONFUSION_MATRIX_PATH = os.path.join(
    RESULTS_DIR,
    "confusion_matrix.csv"
)

RISK_METRICS_PATH = os.path.join(
    RESULTS_DIR,
    "risk_metrics.json"
)

FEATURE_IMPORTANCE_PATH = os.path.join(
    RESULTS_DIR,
    "feature_importance.csv"
)


# ============================================================
# HEADER
# ============================================================

print("")
print("==========================================")
print("       JAL-RAKSHAK AI/ML TRAINING")
print("==========================================")
print("")


# ============================================================
# LOAD DATASET
# ============================================================

if not os.path.exists(DATASET_PATH):

    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}"
    )

print("Loading dataset...")

df = pd.read_csv(
    DATASET_PATH
)

print(
    f"Dataset loaded: {len(df):,} rows"
)

print(
    f"Columns: {len(df.columns)}"
)

print("")


# ============================================================
# CLEAN DATA
# ============================================================

df = df.replace(
    [np.inf, -np.inf],
    np.nan
)


# ============================================================
# SORT BY TIME
# ============================================================

if "timestamp" in df.columns:

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        errors="coerce"
    )

    df = df.sort_values(
        "timestamp"
    ).reset_index(
        drop=True
    )


# ============================================================
# DATA SPLIT
# ============================================================

total_rows = len(df)

train_end = int(
    total_rows * 0.70
)

validation_end = int(
    total_rows * 0.85
)

train_df = df.iloc[
    :train_end
].copy()

validation_df = df.iloc[
    train_end:validation_end
].copy()

test_df = df.iloc[
    validation_end:
].copy()


print("Data split:")
print(
    f"Training   : {len(train_df):,}"
)

print(
    f"Validation : {len(validation_df):,}"
)

print(
    f"Testing    : {len(test_df):,}"
)

print("")


# ============================================================
# EVENT CLASSIFICATION
# ============================================================

print("==========================================")
print("       EVENT CLASSIFIER")
print("==========================================")
print("")


X_train_event = create_features(
    train_df,
    target_column="event",
    exclude_columns=[
        "risk_score"
    ]
)

X_validation_event = create_features(
    validation_df,
    target_column="event",
    exclude_columns=[
        "risk_score"
    ]
)

X_test_event = create_features(
    test_df,
    target_column="event",
    exclude_columns=[
        "risk_score"
    ]
)


# ============================================================
# ALIGN EVENT FEATURES
# ============================================================

event_feature_names = list(
    X_train_event.columns
)

X_validation_event = (
    X_validation_event.reindex(
        columns=event_feature_names,
        fill_value=0
    )
)

X_test_event = (
    X_test_event.reindex(
        columns=event_feature_names,
        fill_value=0
    )
)


# ============================================================
# ENCODE EVENT LABELS
# ============================================================

event_encoder = LabelEncoder()

y_train_event = (
    event_encoder.fit_transform(
        train_df["event"]
    )
)

y_validation_event = (
    event_encoder.transform(
        validation_df["event"]
    )
)

y_test_event = (
    event_encoder.transform(
        test_df["event"]
    )
)


print("Event classes:")

for index, label in enumerate(
    event_encoder.classes_
):

    print(
        f"{index} -> {label}"
    )

print("")


# ============================================================
# TRAIN EVENT MODEL
# ============================================================

print(
    "Training XGBoost event classifier..."
)

event_model = XGBClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.08,
    subsample=0.85,
    colsample_bytree=0.85,
    objective="multi:softprob",
    eval_metric="mlogloss",
    random_state=42,
    tree_method="hist",
    n_jobs=-1
)

event_model.fit(
    X_train_event,
    y_train_event,
    eval_set=[
        (
            X_validation_event,
            y_validation_event
        )
    ],
    verbose=False
)


# ============================================================
# EVENT PREDICTIONS
# ============================================================

event_predictions = (
    event_model.predict(
        X_test_event
    )
)


# ============================================================
# EVENT ACCURACY
# ============================================================

event_accuracy = accuracy_score(
    y_test_event,
    event_predictions
)

print("")
print(
    f"Event Accuracy: {event_accuracy:.4f}"
)

print("")


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    y_test_event,
    event_predictions,
    target_names=event_encoder.classes_,
    output_dict=True,
    zero_division=0
)

print("Classification Report:")

print(
    classification_report(
        y_test_event,
        event_predictions,
        target_names=event_encoder.classes_,
        zero_division=0
    )
)


# Save classification report

with open(
    CLASSIFICATION_REPORT_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        report,
        file,
        indent=4
    )


print(
    "Classification report saved:"
)

print(
    CLASSIFICATION_REPORT_PATH
)

print("")


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test_event,
    event_predictions
)

confusion_df = pd.DataFrame(
    cm,
    index=event_encoder.classes_,
    columns=event_encoder.classes_
)

confusion_df.index.name = "Actual"

confusion_df.to_csv(
    CONFUSION_MATRIX_PATH
)

print(
    "Confusion matrix saved:"
)

print(
    CONFUSION_MATRIX_PATH
)

print("")


# ============================================================
# SAVE EVENT MODEL
# ============================================================

joblib.dump(
    event_model,
    EVENT_MODEL_PATH
)

joblib.dump(
    event_encoder,
    EVENT_ENCODER_PATH
)

joblib.dump(
    event_feature_names,
    EVENT_FEATURES_PATH
)

print("Event model files saved.")

print("")


# ============================================================
# RISK SCORE REGRESSION
# ============================================================

print("==========================================")
print("          RISK SCORE MODEL")
print("==========================================")
print("")


X_train_risk = create_features(
    train_df,
    target_column="risk_score",
    exclude_columns=[
        "event"
    ]
)

X_validation_risk = create_features(
    validation_df,
    target_column="risk_score",
    exclude_columns=[
        "event"
    ]
)

X_test_risk = create_features(
    test_df,
    target_column="risk_score",
    exclude_columns=[
        "event"
    ]
)


# ============================================================
# ALIGN RISK FEATURES
# ============================================================

risk_feature_names = list(
    X_train_risk.columns
)

X_validation_risk = (
    X_validation_risk.reindex(
        columns=risk_feature_names,
        fill_value=0
    )
)

X_test_risk = (
    X_test_risk.reindex(
        columns=risk_feature_names,
        fill_value=0
    )
)


# ============================================================
# RISK TARGET
# ============================================================

y_train_risk = pd.to_numeric(
    train_df["risk_score"],
    errors="coerce"
).fillna(0)

y_validation_risk = pd.to_numeric(
    validation_df["risk_score"],
    errors="coerce"
).fillna(0)

y_test_risk = pd.to_numeric(
    test_df["risk_score"],
    errors="coerce"
).fillna(0)


# ============================================================
# TRAIN RISK MODEL
# ============================================================

print(
    "Training XGBoost risk model..."
)

risk_model = XGBRegressor(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.08,
    subsample=0.85,
    colsample_bytree=0.85,
    objective="reg:squarederror",
    eval_metric="rmse",
    random_state=42,
    tree_method="hist",
    n_jobs=-1
)

risk_model.fit(
    X_train_risk,
    y_train_risk,
    eval_set=[
        (
            X_validation_risk,
            y_validation_risk
        )
    ],
    verbose=False
)


# ============================================================
# RISK PREDICTIONS
# ============================================================

risk_predictions = (
    risk_model.predict(
        X_test_risk
    )
)

risk_predictions = np.clip(
    risk_predictions,
    0,
    100
)


# ============================================================
# RISK METRICS
# ============================================================

mae = mean_absolute_error(
    y_test_risk,
    risk_predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test_risk,
        risk_predictions
    )
)

r2 = r2_score(
    y_test_risk,
    risk_predictions
)


print("")
print(
    f"Risk MAE  : {mae:.4f}"
)

print(
    f"Risk RMSE : {rmse:.4f}"
)

print(
    f"Risk R²   : {r2:.4f}"
)

print("")


# ============================================================
# SAVE RISK METRICS
# ============================================================

risk_metrics = {
    "model": "XGBoost",
    "MAE": float(mae),
    "RMSE": float(rmse),
    "R2": float(r2)
}

with open(
    RISK_METRICS_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        risk_metrics,
        file,
        indent=4
    )


print(
    "Risk metrics saved:"
)

print(
    RISK_METRICS_PATH
)

print("")


# ============================================================
# SAVE RISK MODEL
# ============================================================

joblib.dump(
    risk_model,
    RISK_MODEL_PATH
)

joblib.dump(
    risk_feature_names,
    RISK_FEATURES_PATH
)

print("Risk model files saved.")

print("")


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

event_importance = (
    event_model.feature_importances_
)

risk_importance = (
    risk_model.feature_importances_
)


event_importance_df = pd.DataFrame({
    "feature": event_feature_names,
    "event_importance": event_importance
})

risk_importance_df = pd.DataFrame({
    "feature": risk_feature_names,
    "risk_importance": risk_importance
})


# Merge both models' feature importance

feature_importance_df = pd.merge(
    event_importance_df,
    risk_importance_df,
    on="feature",
    how="outer"
)

feature_importance_df = (
    feature_importance_df.fillna(0)
)


feature_importance_df[
    "combined_importance"
] = (
    feature_importance_df[
        "event_importance"
    ]
    +
    feature_importance_df[
        "risk_importance"
    ]
)


feature_importance_df = (
    feature_importance_df
    .sort_values(
        "combined_importance",
        ascending=False
    )
)


feature_importance_df.to_csv(
    FEATURE_IMPORTANCE_PATH,
    index=False
)


print(
    "Feature importance saved:"
)

print(
    FEATURE_IMPORTANCE_PATH
)

print("")


# ============================================================
# OVERALL METRICS
# ============================================================

metrics = {

    "dataset": {
        "total_rows": int(total_rows),
        "training_rows": int(
            len(train_df)
        ),
        "validation_rows": int(
            len(validation_df)
        ),
        "testing_rows": int(
            len(test_df)
        )
    },

    "event_classifier": {
        "model": "XGBoost",
        "accuracy": float(
            event_accuracy
        )
    },

    "risk_model": {
        "model": "XGBoost",
        "MAE": float(mae),
        "RMSE": float(rmse),
        "R2": float(r2)
    }

}


with open(
    METRICS_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        metrics,
        file,
        indent=4
    )


# ============================================================
# FINAL OUTPUT
# ============================================================

print("==========================================")
print("        TRAINING COMPLETED")
print("==========================================")
print("")

print("MODEL FILES:")
print(
    "✓ event_classifier.joblib"
)

print(
    "✓ event_label_encoder.joblib"
)

print(
    "✓ event_features.joblib"
)

print(
    "✓ risk_model.joblib"
)

print(
    "✓ risk_features.joblib"
)

print("")

print("RESULT FILES:")
print(
    "✓ metrics.json"
)

print(
    "✓ classification_report.json"
)

print(
    "✓ confusion_matrix.csv"
)

print(
    "✓ risk_metrics.json"
)

print(
    "✓ feature_importance.csv"
)

print("")

print(
    "Models folder:"
)

print(
    MODEL_DIR
)

print("")

print(
    "Results folder:"
)

print(
    RESULTS_DIR
)

print("")
print("==========================================")