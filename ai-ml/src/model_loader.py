import os
import joblib


# ==========================================
# PATH
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# ==========================================
# MODEL PATHS
# ==========================================

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


# ==========================================
# LOAD EVENT MODEL
# ==========================================

def load_event_model():

    if not os.path.exists(
        EVENT_MODEL_PATH
    ):
        raise FileNotFoundError(
            f"Event model not found: "
            f"{EVENT_MODEL_PATH}"
        )

    return joblib.load(
        EVENT_MODEL_PATH
    )


def load_event_encoder():

    if not os.path.exists(
        EVENT_ENCODER_PATH
    ):
        raise FileNotFoundError(
            f"Event encoder not found: "
            f"{EVENT_ENCODER_PATH}"
        )

    return joblib.load(
        EVENT_ENCODER_PATH
    )


def load_event_features():

    if not os.path.exists(
        EVENT_FEATURES_PATH
    ):
        raise FileNotFoundError(
            f"Event feature list not found: "
            f"{EVENT_FEATURES_PATH}"
        )

    return joblib.load(
        EVENT_FEATURES_PATH
    )


# ==========================================
# LOAD RISK MODEL
# ==========================================

def load_risk_model():

    if not os.path.exists(
        RISK_MODEL_PATH
    ):
        raise FileNotFoundError(
            f"Risk model not found: "
            f"{RISK_MODEL_PATH}"
        )

    return joblib.load(
        RISK_MODEL_PATH
    )


def load_risk_features():

    if not os.path.exists(
        RISK_FEATURES_PATH
    ):
        raise FileNotFoundError(
            f"Risk feature list not found: "
            f"{RISK_FEATURES_PATH}"
        )

    return joblib.load(
        RISK_FEATURES_PATH
    )


# ==========================================
# LOAD EVERYTHING
# ==========================================

def load_all_models():

    return {

        "event_model":
            load_event_model(),

        "event_encoder":
            load_event_encoder(),

        "event_features":
            load_event_features(),

        "risk_model":
            load_risk_model(),

        "risk_features":
            load_risk_features()
    }


# ==========================================
# TEST
# ==========================================

if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "      JAL-RAKSHAK MODEL LOADER"
    )

    print(
        "=========================================="
    )

    models = load_all_models()

    print(
        "\nEvent model loaded:",
        type(models["event_model"]).__name__
    )

    print(
        "Event encoder loaded:",
        type(models["event_encoder"]).__name__
    )

    print(
        "Risk model loaded:",
        type(models["risk_model"]).__name__
    )

    print(
        "Event features:",
        len(models["event_features"])
    )

    print(
        "Risk features:",
        len(models["risk_features"])
    )

    print(
        "\nAll models loaded successfully."
    )