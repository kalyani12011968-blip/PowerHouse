import numpy as np
import pandas as pd


NUMERIC_FEATURES = [
    "water_level",
    "rainfall",
    "temperature",
    "rise_rate",
    "acceleration",
    "sensor_quality",
    "historical_avg_level",
    "historical_max_level",
    "historical_avg_rise_rate",
    "historical_max_rise_rate",
    "historical_avg_rainfall",
    "level_deviation",
    "rise_rate_deviation",
    "rainfall_deviation",
]


def clean_dataframe(df):

    df = df.copy()

    # Remove CSV index
    if "index" in df.columns:
        df = df.drop(columns=["index"])

    # Convert timestamp
    if "timestamp" in df.columns:

        timestamp = pd.to_datetime(
            df["timestamp"],
            errors="coerce"
        )

        df["hour"] = timestamp.dt.hour
        df["day_of_week"] = timestamp.dt.dayofweek
        df["month"] = timestamp.dt.month

        df["hour_sin"] = np.sin(
            2 * np.pi * df["hour"] / 24
        )

        df["hour_cos"] = np.cos(
            2 * np.pi * df["hour"] / 24
        )

        df["month_sin"] = np.sin(
            2 * np.pi * df["month"] / 12
        )

        df["month_cos"] = np.cos(
            2 * np.pi * df["month"] / 12
        )

        df = df.drop(
            columns=["timestamp"]
        )

    # Numeric conversion
    for column in NUMERIC_FEATURES:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # Derived features

    if {
        "water_level",
        "historical_avg_level"
    }.issubset(df.columns):

        df["level_vs_average"] = (
            df["water_level"]
            - df["historical_avg_level"]
        )

    if {
        "water_level",
        "historical_max_level"
    }.issubset(df.columns):

        df["level_vs_max"] = (
            df["water_level"]
            - df["historical_max_level"]
        )

    if {
        "rise_rate",
        "historical_avg_rise_rate"
    }.issubset(df.columns):

        df["rise_rate_vs_average"] = (
            df["rise_rate"]
            - df["historical_avg_rise_rate"]
        )

    if {
        "rainfall",
        "historical_avg_rainfall"
    }.issubset(df.columns):

        df["rainfall_vs_average"] = (
            df["rainfall"]
            - df["historical_avg_rainfall"]
        )

    # Infinite values
    df = df.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # Fill numeric missing values
    numeric_columns = df.select_dtypes(
        include=[np.number]
    ).columns

    for column in numeric_columns:

        median = df[column].median()

        if pd.isna(median):
            median = 0

        df[column] = df[column].fillna(
            median
        )

    return df


def create_features(
    df,
    target_column=None,
    exclude_columns=None
):

    df = clean_dataframe(df)

    exclude_columns = (
        exclude_columns or []
    )

    columns_to_drop = []

    if target_column:

        if target_column in df.columns:
            columns_to_drop.append(
                target_column
            )

    for column in exclude_columns:

        if column in df.columns:
            columns_to_drop.append(
                column
            )

    X = df.drop(
        columns=columns_to_drop,
        errors="ignore"
    )

    # Encode device ID
    if "device_id" in X.columns:

        X = pd.get_dummies(
            X,
            columns=["device_id"],
            dtype=float
        )

    # Encode water trend
    if "water_trend" in X.columns:

        X = pd.get_dummies(
            X,
            columns=["water_trend"],
            dtype=float
        )

    # Keep numerical features only
    X = X.select_dtypes(
        include=[np.number]
    )

    return X