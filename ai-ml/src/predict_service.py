import sys
import json
import traceback

import pandas as pd
import numpy as np

from feature_engineering import (
    create_features
)

from model_loader import (
    load_all_models
)


# ==========================================
# RISK STATUS
# ==========================================

def get_risk_status(score):

    if score >= 76:
        return "CRITICAL"

    if score >= 51:
        return "WARNING"

    if score >= 26:
        return "WATCH"

    return "SAFE"


# ==========================================
# PREPARE FEATURES
# ==========================================

def prepare_features(
    data,
    feature_names
):

    df = pd.DataFrame(
        [data]
    )

    X = create_features(
        df
    )

    # Make sure every training feature exists
    for feature in feature_names:

        if feature not in X.columns:
            X[feature] = 0

    # Remove unexpected features
    X = X.reindex(
        columns=feature_names,
        fill_value=0
    )

    return X


# ==========================================
# PREDICTION
# ==========================================

def predict(data):

    models = load_all_models()

    event_model = (
        models["event_model"]
    )

    event_encoder = (
        models["event_encoder"]
    )

    event_features = (
        models["event_features"]
    )

    risk_model = (
        models["risk_model"]
    )

    risk_features = (
        models["risk_features"]
    )


    # --------------------------------------
    # EVENT PREDICTION
    # --------------------------------------

    X_event = prepare_features(
        data,
        event_features
    )

    event_prediction = (
        event_model.predict(
            X_event
        )
    )

    event_code = int(
        event_prediction[0]
    )

    event_name = (
        event_encoder
        .inverse_transform(
            [event_code]
        )[0]
    )


    # --------------------------------------
    # EVENT PROBABILITY
    # --------------------------------------

    confidence = None

    probabilities = None

    if hasattr(
        event_model,
        "predict_proba"
    ):

        probabilities = (
            event_model
            .predict_proba(
                X_event
            )[0]
        )

        confidence = float(
            np.max(probabilities)
        )


    # --------------------------------------
    # RISK PREDICTION
    # --------------------------------------

    X_risk = prepare_features(
        data,
        risk_features
    )

    risk_prediction = (
        risk_model.predict(
            X_risk
        )
    )

    risk_score = float(
        np.clip(
            risk_prediction[0],
            0,
            100
        )
    )

    risk_score = round(
        risk_score,
        2
    )


    # --------------------------------------
    # STATUS
    # --------------------------------------

    status = get_risk_status(
        risk_score
    )


    # --------------------------------------
    # RESULT
    # --------------------------------------

    result = {

        "success": True,

        "event": event_name,

        "confidence":
            round(
                confidence,
                4
            )
            if confidence is not None
            else None,

        "riskScore":
            risk_score,

        "status":
            status,

        "modelSource":
            "XGBoost",

        "deviceId":
            data.get(
                "deviceId",
                data.get(
                    "device_id",
                    "UNKNOWN"
                )
            ),

        "waterLevel":
            data.get(
                "waterLevel",
                data.get(
                    "water_level",
                    0
                )
            ),

        "rainfall":
            data.get(
                "rainfall",
                0
            ),

        "temperature":
            data.get(
                "temperature",
                0
            ),

        "riseRate":
            data.get(
                "riseRate",
                data.get(
                    "rise_rate",
                    0
                )
            ),

        "waterTrend":
            data.get(
                "waterTrend",
                data.get(
                    "water_trend",
                    "UNKNOWN"
                )
            )
    }


    return result


# ==========================================
# MAIN
# ==========================================

def main():

    try:

        if len(sys.argv) < 2:

            raise ValueError(
                "Sensor data JSON is required"
            )

        raw_data = sys.argv[1]

        data = json.loads(
            raw_data
        )

        result = predict(
            data
        )

        print(
            json.dumps(
                result
            )
        )

    except Exception as error:

        result = {

            "success": False,

            "event": "NORMAL",

            "confidence": 0.0,

            "riskScore": 0.0,

            "status": "SAFE",

            "modelSource": "error",

            "error":
                str(error)
        }

        print(
            json.dumps(
                result
            )
        )


if __name__ == "__main__":

    main()